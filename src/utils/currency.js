const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export function formatIDR(value) {
  return idrFormatter.format(Number(value) || 0);
}
