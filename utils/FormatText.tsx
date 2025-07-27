export const formatFirstLetterCap = (tcg: string): string => {
  if (!tcg) return '';
  return tcg.charAt(0).toUpperCase() + tcg.slice(1).toLowerCase();
};