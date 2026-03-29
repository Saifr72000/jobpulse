import { ValueCardAccount } from "../models/valueCardAccount.model.js";
import { User } from "../models/user.model.js";
import { VALUE_CARD_TIERS, getTierById } from "../constants/valueCardTiers.js";

export function getTierCatalog() {
  return VALUE_CARD_TIERS;
}

export async function getAccountForUser(userId: string) {
  const user = await User.findById(userId).select("company").lean();
  if (!user) {
    throw new Error("User not found");
  }

  const account = await ValueCardAccount.findOne({ company: user.company })
    .select("remainingBalance cardName purchasedAt purchasedBy")
    .lean();

  if (!account || account.remainingBalance <= 0) {
    return { active: false as const };
  }

  return {
    active: true as const,
    remainingBalance: account.remainingBalance,
    cardName: account.cardName,
    purchasedAt: account.purchasedAt.toISOString(),
  };
}

export async function purchaseValueCard(userId: string, tierId: string) {
  const tier = getTierById(tierId);
  if (!tier) {
    throw new Error("Invalid tier");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  const account = await ValueCardAccount.findOneAndUpdate(
    { company: user.company },
    {
      $inc: { remainingBalance: tier.balance },
      $set: {
        cardName: tier.name,
        purchasedAt: now,
        purchasedBy: user._id,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );

  return {
    remainingBalance: account.remainingBalance,
    cardName: account.cardName,
    purchasedAt: account.purchasedAt.toISOString(),
  };
}
