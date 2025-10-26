// utils/validators.ts
export const checkIsNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const checkIsPositiveNumber = (value: string): boolean => {
  return Number(value) > 0;
};

// مثال: اگه خواستی تابع جدید اضافه کنی فقط اینجا بنویس
export const checkIsEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
