import { Coin, Transaction, UserWallet } from "./interfaces";

export const formatAsCurrency = (price: number, decimalPlaces = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimalPlaces,
  }).format(price);
};

export const formatNumber = (number: number, asCurrency = true): string => {
  if (number === 0) {
    return asCurrency ? formatAsCurrency(0) : "0";
  }

  const isNegative = number < 0;
  const absNumber = Math.abs(number);

  const numToReturn = isNegative ? -absNumber : +absNumber;

  if (absNumber >= 0.01) {
    return asCurrency ? formatAsCurrency(numToReturn) : numToReturn.toFixed(2);
  } else {
    const decimalString = absNumber.toString().split(".")[1];
    if (!decimalString) {
      return asCurrency ? formatAsCurrency(0) : "0";
    }

    const firstNonZeroIndex = decimalString
      .split("")
      .findIndex((digit) => digit !== "0");

    return asCurrency
      ? formatAsCurrency(numToReturn, firstNonZeroIndex + 4)
      : numToReturn.toFixed(firstNonZeroIndex + 4);
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

export const extractLastWord = (string: string) => {
  const words = string.trim().split(" ");

  return words[words.length - 1];
};

export const calculateTotalSold = (transactions: Transaction[]) => {
  const sellTransactions = transactions.filter(
    (transaction) => transaction.type === "sell"
  );

  const costArray = sellTransactions.map(
    (transaction) => transaction.pricePerCoin * transaction.quantity
  );
  const totalCost = costArray.reduce((acc, currentVal) => acc + currentVal, 0);

  return +totalCost.toFixed(2);
};

export const calculateBoughtQty = (transactions: Transaction[]) => {
  const buyTransactions = transactions.filter(
    (transaction) => transaction.type === "buy"
  );

  const costArray = buyTransactions.map((transaction) => transaction.quantity);
  const totalQty = costArray.reduce((acc, currentVal) => acc + currentVal, 0);

  return +totalQty;
};

export const isValidInput = (input: string) => {
  return /^(?:\d+(?:[.,]\d*)?|\d*(?:[.,]\d+)?|)$/.test(input);
};
