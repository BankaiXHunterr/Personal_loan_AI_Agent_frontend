export const formatINR = (n: number): string =>
  '₹' + Math.round(n).toLocaleString('en-IN');

export function calcEMI(P: number, annualRate: number, months: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return P / months;
  const x = Math.pow(1 + r, months);
  return (P * r * x) / (x - 1);
}
