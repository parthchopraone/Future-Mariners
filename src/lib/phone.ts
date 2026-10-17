export const normalizePhone = (value: string) => value.replace(/[\s()-]/g, "");

export const isValidPhone = (value: string) => {
  const normalized = normalizePhone(value);
  return /^\+?[0-9]{7,15}$/.test(normalized);
};