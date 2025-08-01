"use client";

// I've removed the redundant QueryClientProvider and SessionProvider from this file.
import { Provider as ReactReduxProvider } from "react-redux";
import { store } from "@/redux/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <ReactReduxProvider store={store}>{children}</ReactReduxProvider>;
}