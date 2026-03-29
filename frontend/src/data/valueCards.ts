export interface ValueCardTier {
  id: string;
  name: string;
  price: number;
  balance: number;
}

/** Same tiers as product spec — keep in sync with backend `constants/valueCardTiers.ts` */
export const VALUE_CARDS: ValueCardTier[] = [
  { id: "vc-100", name: "Value 100 000", price: 90000, balance: 100000 },
  { id: "vc-250", name: "Value 250 000", price: 222500, balance: 250000 },
  { id: "vc-400", name: "Value 400 000", price: 352000, balance: 400000 },
  { id: "vc-650", name: "Value 650 000", price: 565500, balance: 650000 },
];
