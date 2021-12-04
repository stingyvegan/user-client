export function isNumber(val: any) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}
