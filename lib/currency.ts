type CurrencyValue = number | bigint | { toString(): string } | null | undefined;

export function formatCurrency(value: CurrencyValue) {
  if (value === null || value === undefined) {
    return "On request";
  }

  return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
