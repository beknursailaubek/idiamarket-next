export const getProductWord = (count: number): string => {
  switch (true) {
    case count % 10 === 1 && count % 100 !== 11:
      return "товар";
    case [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100):
      return "товара";
    default:
      return "товаров";
  }
};
