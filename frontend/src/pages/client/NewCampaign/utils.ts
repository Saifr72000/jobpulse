import type { FormState, Product } from "./types";

export function calculatePackagePrice(
  planType: string | null,
  selectedPackage: string | null,
  packages: Product[]
): number {
  if (planType === "package" && selectedPackage) {
    const pkg = packages.find((p) => p.title.toLowerCase().includes(selectedPackage));
    return pkg?.price ?? 0;
  }
  return 0;
}

export function calculateChannelCost(
  planType: string | null,
  selectedChannels: string[],
  channels: Product[]
): number {
  if (planType === "package") return 0;
  return selectedChannels.reduce((sum, channelTitle) => {
    const channel = channels.find((ch) => ch.title.toLowerCase() === channelTitle.toLowerCase());
    return sum + (channel?.price ?? 0);
  }, 0);
}

export function calculateAddonsCost(
  selectedAddons: string[],
  addons: Product[]
): number {
  return selectedAddons.reduce((sum, addonTitle) => {
    const addon = addons.find((a) => a.title.toLowerCase().includes(addonTitle.toLowerCase()));
    return sum + (addon?.price ?? 0);
  }, 0);
}

export function calculateSubtotal(
  form: FormState,
  channels: Product[],
  packages: Product[],
  addons: Product[]
): number {
  return (
    calculatePackagePrice(form.planType, form.selectedPackage, packages) +
    calculateChannelCost(form.planType, form.selectedChannels, channels) +
    calculateAddonsCost(form.selectedAddons, addons)
  );
}

export function calculateVat(subtotal: number): number {
  return Math.round(subtotal * 0.25);
}

export function canContinueStep1(form: FormState): boolean {
  if (form.planType === "custom") return form.selectedChannels.length > 0;
  if (form.planType === "package") return form.selectedPackage !== null;
  return false;
}

export function canContinueStep2(form: FormState): boolean {
  return form.selectedChannels.length > 0;
}
