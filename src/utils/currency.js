export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (currencyString) => {
  return parseFloat(currencyString.replace(/[$,]/g, "")) || 0;
};