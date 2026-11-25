export type Campus = 'Main Campus' | 'Girls College' | 'Diploma Block'

export const CAMPUSES: Campus[] = [
  'Main Campus',
  'Girls College',
  'Diploma Block',
]

export type MenuCategory = 'Breakfast' | 'Snacks' | 'Meals' | 'Beverages'

export const CATEGORIES: MenuCategory[] = [
  'Breakfast',
  'Snacks',
  'Meals',
  'Beverages',
]

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: MenuCategory
  prepMinutes: number
  soldOut: boolean
  veg: boolean
  rating: number
  soldToday: number
}

export const MENU: MenuItem[] = [
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    description: 'Crispy dosa, potato masala, coconut chutney & sambar.',
    price: 60,
    image: '/food/masala-dosa.png',
    category: 'Breakfast',
    prepMinutes: 8,
    soldOut: false,
    veg: true,
    rating: 4.7,
    soldToday: 48,
  },
  {
    id: 'poha',
    name: 'Kanda Poha',
    description: 'Light flattened rice with sev, coriander and lemon.',
    price: 30,
    image: '/food/poha.png',
    category: 'Breakfast',
    prepMinutes: 4,
    soldOut: false,
    veg: true,
    rating: 4.3,
    soldToday: 62,
  },
  {
    id: 'aloo-paratha',
    name: 'Aloo Paratha',
    description: 'Two stuffed parathas with butter and fresh curd.',
    price: 55,
    image: '/food/aloo-paratha.png',
    category: 'Breakfast',
    prepMinutes: 10,
    soldOut: false,
    veg: true,
    rating: 4.6,
    soldToday: 27,
  },
  {
    id: 'vada-pav',
    name: 'Vada Pav (2 pc)',
    description: 'Batata vada, dry garlic chutney, fried chilli.',
    price: 25,
    image: '/food/vada-pav.png',
    category: 'Snacks',
    prepMinutes: 3,
    soldOut: false,
    veg: true,
    rating: 4.8,
    soldToday: 94,
  },
  {
    id: 'samosa',
    name: 'Samosa (2 pc)',
    description: 'Hot crispy samosa with mint & tamarind chutney.',
    price: 20,
    image: '/food/samosa.png',
    category: 'Snacks',
    prepMinutes: 3,
    soldOut: false,
    veg: true,
    rating: 4.5,
    soldToday: 108,
  },
  {
    id: 'paneer-sandwich',
    name: 'Grilled Paneer Sandwich',
    description: 'Masala paneer, capsicum and cheese, grilled crisp.',
    price: 70,
    image: '/food/paneer-sandwich.png',
    category: 'Snacks',
    prepMinutes: 7,
    soldOut: true,
    veg: true,
    rating: 4.4,
    soldToday: 35,
  },
  {
    id: 'veg-thali',
    name: 'Gujarati Veg Thali',
    description: 'Dal, sabji, 3 roti, rice, salad & chaas.',
    price: 90,
    image: '/food/veg-thali.png',
    category: 'Meals',
    prepMinutes: 12,
    soldOut: false,
    veg: true,
    rating: 4.9,
    soldToday: 71,
  },
  {
    id: 'pav-bhaji',
    name: 'Pav Bhaji',
    description: 'Buttery bhaji with two toasted pav, onion & lemon.',
    price: 75,
    image: '/food/pav-bhaji.png',
    category: 'Meals',
    prepMinutes: 9,
    soldOut: false,
    veg: true,
    rating: 4.7,
    soldToday: 58,
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee',
    description: 'Frothy blended coffee served chilled.',
    price: 45,
    image: '/food/cold-coffee.png',
    category: 'Beverages',
    prepMinutes: 4,
    soldOut: false,
    veg: true,
    rating: 4.6,
    soldToday: 83,
  },
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    description: 'Kadak chai with ginger, cardamom and clove.',
    price: 15,
    image: '/food/masala-chai.png',
    category: 'Beverages',
    prepMinutes: 2,
    soldOut: false,
    veg: true,
    rating: 4.8,
    soldToday: 156,
  },
]

export type OrderStatus = 'Preparing' | 'Ready' | 'Collected'

export type OrderLine = {
  itemId: string
  name: string
  price: number
  qty: number
  image: string
}

export type Order = {
  id: string
  token: number
  lines: OrderLine[]
  total: number
  status: OrderStatus
  placedAt: string
  campus: Campus
  student: string
  enrollment: string
  etaMinutes: number
}

export const STUDENT = {
  name: 'Demo Student',
  enrollment: 'DEMO-0000',
  department: 'B.C.A. — Computer Applications',
  semester: 'Semester 5',
  campus: 'Main Campus' as Campus,
  initials: 'RC',
}

export const PAST_ORDERS: Order[] = [
  {
    id: 'o-1041',
    token: 41,
    lines: [
      {
        itemId: 'veg-thali',
        name: 'Gujarati Veg Thali',
        price: 90,
        qty: 1,
        image: '/food/veg-thali.png',
      },
      {
        itemId: 'masala-chai',
        name: 'Masala Chai',
        price: 15,
        qty: 1,
        image: '/food/masala-chai.png',
      },
    ],
    total: 105,
    status: 'Collected',
    placedAt: 'Yesterday · 1:12 PM',
    campus: 'Main Campus',
    student: STUDENT.name,
    enrollment: STUDENT.enrollment,
    etaMinutes: 12,
  },
  {
    id: 'o-1022',
    token: 22,
    lines: [
      {
        itemId: 'vada-pav',
        name: 'Vada Pav (2 pc)',
        price: 25,
        qty: 2,
        image: '/food/vada-pav.png',
      },
    ],
    total: 50,
    status: 'Collected',
    placedAt: 'Mon · 11:05 AM',
    campus: 'Main Campus',
    student: STUDENT.name,
    enrollment: STUDENT.enrollment,
    etaMinutes: 5,
  },
  {
    id: 'o-0987',
    token: 87,
    lines: [
      {
        itemId: 'cold-coffee',
        name: 'Cold Coffee',
        price: 45,
        qty: 1,
        image: '/food/cold-coffee.png',
      },
      {
        itemId: 'samosa',
        name: 'Samosa (2 pc)',
        price: 20,
        qty: 1,
        image: '/food/samosa.png',
      },
    ],
    total: 65,
    status: 'Collected',
    placedAt: 'Fri · 4:40 PM',
    campus: 'Girls College',
    student: STUDENT.name,
    enrollment: STUDENT.enrollment,
    etaMinutes: 6,
  },
]

/* ---------- Admin dashboard mock data ---------- */

export type QueueOrder = {
  id: string
  token: number
  student: string
  enrollment: string
  campus: Campus
  lines: { name: string; qty: number }[]
  total: number
  status: OrderStatus
  minutesAgo: number
}

export const LIVE_QUEUE: QueueOrder[] = [
  {
    id: 'q-58',
    token: 58,
    student: 'Dhruv Mehta',
    enrollment: '22BTC1183',
    campus: 'Main Campus',
    lines: [
      { name: 'Pav Bhaji', qty: 1 },
      { name: 'Masala Chai', qty: 2 },
    ],
    total: 105,
    status: 'Preparing',
    minutesAgo: 1,
  },
  {
    id: 'q-57',
    token: 57,
    student: 'Ayesha Pathan',
    enrollment: '24BBA0219',
    campus: 'Girls College',
    lines: [{ name: 'Gujarati Veg Thali', qty: 1 }],
    total: 90,
    status: 'Preparing',
    minutesAgo: 3,
  },
  {
    id: 'q-56',
    token: 56,
    student: 'Karan Solanki',
    enrollment: '23DIP0641',
    campus: 'Diploma Block',
    lines: [
      { name: 'Vada Pav (2 pc)', qty: 2 },
      { name: 'Cold Coffee', qty: 1 },
    ],
    total: 95,
    status: 'Preparing',
    minutesAgo: 5,
  },
  {
    id: 'q-55',
    token: 55,
    student: 'Nidhi Trivedi',
    enrollment: '22BCA0330',
    campus: 'Main Campus',
    lines: [{ name: 'Masala Dosa', qty: 1 }],
    total: 60,
    status: 'Ready',
    minutesAgo: 8,
  },
  {
    id: 'q-54',
    token: 54,
    student: 'Yash Bhatt',
    enrollment: '21BTC0908',
    campus: 'Main Campus',
    lines: [
      { name: 'Samosa (2 pc)', qty: 3 },
      { name: 'Masala Chai', qty: 3 },
    ],
    total: 105,
    status: 'Ready',
    minutesAgo: 9,
  },
  {
    id: 'q-53',
    token: 53,
    student: 'Hetal Rathod',
    enrollment: '24BBA0117',
    campus: 'Girls College',
    lines: [{ name: 'Kanda Poha', qty: 2 }],
    total: 60,
    status: 'Collected',
    minutesAgo: 14,
  },
  {
    id: 'q-52',
    token: 52,
    student: 'Mohit Parmar',
    enrollment: '23DIP0512',
    campus: 'Diploma Block',
    lines: [{ name: 'Aloo Paratha', qty: 1 }],
    total: 55,
    status: 'Collected',
    minutesAgo: 18,
  },
]

export const HOURLY_SALES = [
  { hour: '8 AM', orders: 12, revenue: 640 },
  { hour: '9 AM', orders: 24, revenue: 1180 },
  { hour: '10 AM', orders: 38, revenue: 2260 },
  { hour: '11 AM', orders: 52, revenue: 3410 },
  { hour: '12 PM', orders: 74, revenue: 5980 },
  { hour: '1 PM', orders: 88, revenue: 7240 },
  { hour: '2 PM', orders: 46, revenue: 3120 },
  { hour: '3 PM', orders: 31, revenue: 1890 },
  { hour: '4 PM', orders: 40, revenue: 2480 },
  { hour: '5 PM', orders: 22, revenue: 1310 },
]

export const CATEGORY_SPLIT = [
  { category: 'Snacks', value: 38 },
  { category: 'Meals', value: 27 },
  { category: 'Beverages', value: 22 },
  { category: 'Breakfast', value: 13 },
]

export const rupee = (n: number) => `₹${n.toLocaleString('en-IN')}`
