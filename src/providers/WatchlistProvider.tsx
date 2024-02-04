"use client";

import { Watchlist } from "@/utils/interfaces";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type WatchlistContext = {
  watchlists: Watchlist[];
  selectedWatchlist: Watchlist | null;
  setWatchlists: Dispatch<SetStateAction<Watchlist[]>>;
  setSelectedWatchlist: Dispatch<SetStateAction<Watchlist | null>>;
};

const WatchlistContext = createContext<WatchlistContext | null>(null);

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }

  return context;
}

type WatchlistProviderProps = {
  children: ReactNode;
};

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(
    null
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        selectedWatchlist,
        setWatchlists,
        setSelectedWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}
