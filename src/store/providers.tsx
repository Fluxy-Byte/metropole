"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";
import { store, persistor } from "@/store";
import { swrFetcher } from "@/lib/http";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SWRConfig
          value={{
            fetcher: swrFetcher,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
          }}
        >
          {children}
        </SWRConfig>
      </PersistGate>
    </Provider>
  );
}
