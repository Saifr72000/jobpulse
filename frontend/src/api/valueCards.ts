import api from "./axios";

export interface ValueCardAccountActive {
  active: true;
  remainingBalance: number;
  cardName: string;
  purchasedAt: string;
}

export interface ValueCardAccountInactive {
  active: false;
}

export type ValueCardAccountResponse = ValueCardAccountActive | ValueCardAccountInactive;

export async function getValueCardAccount(): Promise<ValueCardAccountResponse> {
  const { data } = await api.get<ValueCardAccountResponse>("/value-cards/account");
  return data;
}

export async function purchaseValueCard(tierId: string): Promise<{
  remainingBalance: number;
  cardName: string;
  purchasedAt: string;
}> {
  const { data } = await api.post("/value-cards/purchase", { tierId });
  return data;
}
