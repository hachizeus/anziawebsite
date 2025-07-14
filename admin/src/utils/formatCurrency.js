/**
 * Format a number as Kenyan Shillings
 * @param {number} amount - The amount to format
 * @returns {string} Formatted amount with KSh symbol
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'KSh 0';
  
  return `KSh ${Number(amount).toLocaleString('en-KE')}`;
};

export default formatCurrency;