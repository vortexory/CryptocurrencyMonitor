export const formatAsCurrency = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatPrice = (price: number, asCurrency: boolean = true) => {
  if (price >= 0.01) {
    return formatAsCurrency
      ? formatAsCurrency(+price.toFixed(2))
      : +price.toFixed(2);
  } else {
    const priceAsString = price.toString();

    const decimals = priceAsString.split(".")[1];

    let initialIndex = 0;

    for (let i = 0; i <= decimals.length - 1; i++) {
      if (decimals[i] === "0") {
        initialIndex += 1;
      } else {
        break;
      }
    }

    const toFixed = initialIndex + 2;
    return asCurrency
      ? formatAsCurrency(+price.toFixed(toFixed))
      : +price.toFixed(toFixed);
  }
};
