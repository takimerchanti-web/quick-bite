'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  MENU,
  PAST_ORDERS,
  STUDENT,
  type Campus,
  type MenuItem,
  type Order,
  type OrderLine,
  type OrderStatus,
} from './data'

type CartMap = Record<string, number>

type AppStore = {
  campus: Campus
  setCampus: (c: Campus) => void
  enrollment: string
  setEnrollment: (v: string) => void
  menu: MenuItem[]
  toggleSoldOut: (id: string) => void
  cart: CartMap
  cartLines: OrderLine[]
  cartCount: number
  cartTotal: number
  addToCart: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  clearCart: () => void
  orders: Order[]
  activeOrder: Order | null
  placeOrder: () => Order
  advanceStatus: (id: string, status: OrderStatus) => void
  reorder: (order: Order) => void
  ordersAhead: number
}

const AppStoreContext = createContext<AppStore | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [campus, setCampus] = useState<Campus>(STUDENT.campus)
  const [enrollment, setEnrollment] = useState(STUDENT.enrollment)
  const [menu, setMenu] = useState<MenuItem[]>(MENU)
  const [cart, setCart] = useState<CartMap>({})
  const [orders, setOrders] = useState<Order[]>(PAST_ORDERS)
  const [nextToken, setNextToken] = useState(59)
  const [ordersAhead] = useState(4)

  const toggleSoldOut = useCallback((id: string) => {
    setMenu((prev) =>
      prev.map((m) => (m.id === id ? { ...m, soldOut: !m.soldOut } : m)),
    )
  }, [])

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty }))
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }, [])

  const clearCart = useCallback(() => setCart({}), [])

  const cartLines = useMemo<OrderLine[]>(
    () =>
      Object.entries(cart)
        .map(([itemId, qty]) => {
          const item = menu.find((m) => m.id === itemId)
          if (!item) return null
          return {
            itemId,
            name: item.name,
            price: item.price,
            qty,
            image: item.image,
          }
        })
        .filter((l): l is OrderLine => l !== null),
    [cart, menu],
  )

  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0)
  const cartTotal = cartLines.reduce((s, l) => s + l.qty * l.price, 0)

  const activeOrder = useMemo(
    () => orders.find((o) => o.status !== 'Collected') ?? null,
    [orders],
  )

  const placeOrder = useCallback(() => {
    const eta = cartLines.reduce((max, line) => {
      const item = menu.find((m) => m.id === line.itemId)
      return Math.max(max, item?.prepMinutes ?? 5)
    }, 0)

    const order: Order = {
      id: `o-${nextToken}`,
      token: nextToken,
      lines: cartLines,
      total: cartTotal,
      status: 'Preparing',
      placedAt: 'Just now',
      campus,
      student: STUDENT.name,
      enrollment,
      etaMinutes: Math.max(4, eta + ordersAhead * 2),
    }

    setOrders((prev) => [order, ...prev])
    setNextToken((t) => t + 1)
    setCart({})
    return order
  }, [cartLines, cartTotal, campus, enrollment, menu, nextToken, ordersAhead])

  const advanceStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    )
  }, [])

  const reorder = useCallback((order: Order) => {
    setCart(() => {
      const next: CartMap = {}
      for (const line of order.lines) next[line.itemId] = line.qty
      return next
    })
  }, [])

  const value: AppStore = {
    campus,
    setCampus,
    enrollment,
    setEnrollment,
    menu,
    toggleSoldOut,
    cart,
    cartLines,
    cartCount,
    cartTotal,
    addToCart,
    setQty,
    clearCart,
    orders,
    activeOrder,
    placeOrder,
    advanceStatus,
    reorder,
    ordersAhead,
  }

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used inside AppStoreProvider')
  return ctx
}
