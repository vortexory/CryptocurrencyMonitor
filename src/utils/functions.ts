import { Coin, Transaction, UserWallet } from "./interfaces";

export const formatAsCurrency = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatPrice = (price: number, asCurrency: boolean = true) => {
  const priceInCents = Math.round(price * 100);

  if (priceInCents === 0) return asCurrency ? formatAsCurrency(0) : 0;

  if (priceInCents >= 1) {
    return asCurrency
      ? formatAsCurrency(priceInCents / 100)
      : priceInCents / 100;
  } else {
    const priceAsString = priceInCents.toString();
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
      ? formatAsCurrency(priceInCents / 100).replace(/\..*/, "")
      : priceInCents / 100;
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
