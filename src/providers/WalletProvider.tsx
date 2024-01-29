"use client";

import { CoinData, TransactionsView } from "@/utils/interfaces";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type WalletContext = {
  selectedCoin: CoinData | null;
  transactionsView: TransactionsView;
  setTransactionsView: Dispatch<SetStateAction<TransactionsView>>;
  selectCoin: (coin: CoinData) => void;
  unselectCoin: () => void;
};

const WalletContext = createContext<WalletContext | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
}

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [transactionsView, setTransactionsView] = useState<TransactionsView>({
    open: false,
    coin: null,
  });

  const selectCoin = (coin: CoinData) => {
    setSelectedCoin(coin);
  };

  const unselectCoin = () => {
    setSelectedCoin(null);
  };

  return (
    <WalletContext.Provider
      value={{
        selectedCoin,
        transactionsView,
        setTransactionsView,
        selectCoin,
        unselectCoin,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
