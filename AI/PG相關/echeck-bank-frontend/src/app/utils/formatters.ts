export function formatTwdAmount(amount: number): string {
  const formatted = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(amount);
  return `新臺幣 ${formatted} 元整`;
}

export function formatDateYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

