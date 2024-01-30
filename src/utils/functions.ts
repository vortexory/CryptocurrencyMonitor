import { Coin, Transaction, UserWallet } from "./interfaces";

export const formatAsCurrency = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatPrice = (price: number, asCurrency: boolean = true) => {
  if (price === 0) return asCurrency ? formatAsCurrency(0) : 0;

  if (price >= 0.01) {
    return asCurrency ? formatAsCurrency(+price.toFixed(2)) : +price.toFixed(2);
  } else {
    const priceAsString = price.toString();

    const decimals = priceAsString.split(".")[1];

    let initialIndex = 0;

    for (let i = 0; i <= decimals?.length - 1; i++) {
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

export const calculateAvgPrices = (transactions: Transaction[]) => {
  const buyTransactions = transactions.filter(
    (transaction) => transaction.type === "buy"
  );

  const sellTransactions = transactions.filter(
    (transaction) => transaction.type === "sell"
  );

  const calculateAvgPrice = (filteredTransactions: Transaction[]) => {
    if (filteredTransactions.length === 0) return 0;

    const costArray = filteredTransactions.map(
      (transaction) => transaction.pricePerCoin * transaction.quantity
    );
    const quantityArray = filteredTransactions.map(
      (transaction) => transaction.quantity
    );

    const totalCost = costArray.reduce(
      (acc, currentVal) => acc + currentVal,
      0
    );
    const totalQuantity = quantityArray.reduce(
      (acc, currentVal) => acc + currentVal,
      0
    );

    return totalCost / totalQuantity;
  };

  const avgBuyPrice = calculateAvgPrice(buyTransactions);
  const avgSellPrice = calculateAvgPrice(sellTransactions);

  return { avgBuyPrice, avgSellPrice };
};

export const aggregateCoins = (wallets: UserWallet[]) => {
  let combinedCoins: Coin[] = [];

  wallets.forEach((wallet) => {
    wallet.coins.forEach((coin) => {
      let existingCoin = combinedCoins.find(
        (c) => c.coinApiID === coin.coinApiID
      );

      if (existingCoin) {
        existingCoin.transactions = existingCoin.transactions.concat(
          coin.transactions
        );
      } else {
        combinedCoins.push({ ...coin });
      }
    });
  });

  return combinedCoins;
};

export const calculateCoinValue = (coin: Coin) => {
  const totalValue = coin.transactions.reduce((acc, transaction) => {
    return acc + transaction.pricePerCoin * transaction.quantity;
  }, 0);

  return {
    name: coin.name,
    value: +totalValue.toFixed(2),
  };
};

export const getColorByIndex = (index: number) => {
  const colors = [
    "#5178ff",
    "#00cf8a",
    "#f8c084",
    "#ff8065",
    "#00bcd7",
    "#9745ff",
    "#284de0",
    "#afb9cb",
  ];
  return colors[index % colors.length];
};

export const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  } as Intl.DateTimeFormatOptions;

  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate;
};
