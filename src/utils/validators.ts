export const checkIsNumber = (value: string): true | string => {
  return !isNaN(Number(value)) ? true : "Value must be a valid number";
};

export const checkIsPositiveNumber = (value: string): true | string => {
  if (Number(value) > 0) return true;
  return "Number must be positive";
};

export const checkIsEmail = (value: string): true | string => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? true
    : "Invalid email address";
};
