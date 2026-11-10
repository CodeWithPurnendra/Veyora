const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// 89.99 -> $89.99    129 -> $129.00
export function formatPrice(amount) {
  return formatter.format(amount)
}