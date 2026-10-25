/** Parse SGD entered in dollars into exact integer cents (no floating point rounding). */
export function parseSgdAmount(raw: string): number {
  const value = raw.trim()
  if (!/^(0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(value)) {
    throw new Error('Enter a non-negative SGD amount with at most two decimal places')
  }
  const [dollars, fraction = ''] = value.split('.')
  const cents = BigInt(dollars) * 100n + BigInt((fraction + '00').slice(0, 2))
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Amount exceeds supported range')
  return Number(cents)
}

export function formatSgd(cents: number): string {
  if (!Number.isSafeInteger(cents)) throw new Error('Money must be an integer number of cents')
  // Locale currency symbols vary across ICU versions; SGD must stay explicit.
  const absolute = BigInt(cents < 0 ? -cents : cents)
  const dollars = new Intl.NumberFormat('en-SG', { maximumFractionDigits: 0 }).format(absolute / 100n)
  const fraction = String(absolute % 100n).padStart(2, '0')
  return (cents < 0 ? '-' : '') + 'S$' + dollars + '.' + fraction
}
