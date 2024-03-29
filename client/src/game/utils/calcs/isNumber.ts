export const isNumber = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
};
