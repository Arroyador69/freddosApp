export type Product = {
  id: string;
  name: string;
  points: number;
};

export type Reward = {
  id: string;
  name: string;
  cost: number;
};

export const STORE = {
  name: "Freddo's",
  // MVP: coordenadas aproximadas (cámbialas por las reales cuando las tengas).
  // Esto se usa para notificaciones por proximidad (600m).
  // Dirección: C. España, 23, 29640 Fuengirola, Málaga
  // Coordenadas (referencia Fuengirola 29640): 36.5388398, -4.6233974
  latitude: 36.5388398,
  longitude: -4.6233974,
  radiusMeters: 600,
} as const;

export const PRODUCTS: Product[] = [
  { id: 'coffee', name: 'Café', points: 10 },
  { id: 'cappuccino', name: 'Cappuccino', points: 15 },
  { id: 'matcha', name: 'Matcha', points: 18 },
  { id: 'extra-shot', name: 'Extra shot', points: 6 },
];

export const REWARDS: Reward[] = [
  { id: 'free-coffee', name: 'Café gratis', cost: 100 },
  { id: 'discount-2', name: 'Descuento 2€', cost: 60 },
  { id: 'extra-free', name: 'Extra gratis', cost: 35 },
];

