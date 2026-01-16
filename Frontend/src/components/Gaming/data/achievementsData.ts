// ==================== RESTAURANT DATA ====================

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  ownerPassword: string; // In production, this should be hashed
  category: "pizza" | "kabab" | "restaurant";
}

export const restaurants: Restaurant[] = [
  {
    id: "pizza-hut",
    name: "Pizza Hut",
    logo: "🍕",
    description: "Large pizza with drinks for 2 persons",
    location: "Dhanmondi, Dhaka",
    ownerPassword: "PIZZA2025", // Demo password
    category: "pizza",
  },
  {
    id: "masallah-kabab",
    name: "Masallah Kabab",
    logo: "🍢",
    description: "Special kabab platter for 2 persons",
    location: "Shahbag, Dhaka",
    ownerPassword: "KABAB2025", // Demo password
    category: "kabab",
  },
  {
    id: "coivoj",
    name: "Coivoj Restaurant",
    logo: "🍽️",
    description: "Full buffet meal for 1 person",
    location: "Mirpur, Dhaka",
    ownerPassword: "COIVOJ2025", // Demo password
    category: "restaurant",
  },
];

// ==================== WINNING TICKET DATA ====================

export interface WinningTicket {
  id: string;
  userId: string;
  tournamentId: string;
  isUsed: boolean;
  usedAt?: string;
  restaurantId?: string;
  billAmount?: number;
}

// Mock winning tickets for current user
export const mockUserTickets: WinningTicket[] = [
  {
    id: "ticket-001",
    userId: "current-user",
    tournamentId: "tournament-001",
    isUsed: false,
  },
  {
    id: "ticket-002",
    userId: "current-user",
    tournamentId: "tournament-002",
    isUsed: false,
  },
  {
    id: "ticket-003",
    userId: "current-user",
    tournamentId: "tournament-000",
    isUsed: true,
    usedAt: "2025-09-22",
    restaurantId: "pizza-hut",
    billAmount: 450,
  },
];

// ==================== RESTAURANT TRANSACTION DATA ====================

export interface RestaurantTransaction {
  restaurantId: string;
  restaurantName: string;
  totalAmount: number;
  totalTicketsUsed: number;
  tickets: WinningTicket[];
  lastSettlementDate?: string;
}

// Mock transactions (for admin/owner view)
export const mockRestaurantTransactions: RestaurantTransaction[] = [
  {
    restaurantId: "pizza-hut",
    restaurantName: "Pizza Hut",
    totalAmount: 1250,
    totalTicketsUsed: 3,
    tickets: [],
    lastSettlementDate: "2025-09-30",
  },
  {
    restaurantId: "masallah-kabab",
    restaurantName: "Masallah Kabab",
    totalAmount: 800,
    totalTicketsUsed: 2,
    tickets: [],
    lastSettlementDate: "2025-09-30",
  },
  {
    restaurantId: "coivoj",
    restaurantName: "Coivoj Restaurant",
    totalAmount: 0,
    totalTicketsUsed: 0,
    tickets: [],
  },
];
