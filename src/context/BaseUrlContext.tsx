// src/context/BaseUrlContext.tsx
"use client";

import { createContext, useContext } from "react";

export const BaseUrlContext = createContext<string | null>(null);

export const useBaseUrl = () => {
  const ctx = useContext(BaseUrlContext);
  if (!ctx) throw new Error("useBaseUrl must be used within BaseUrlProvider");
  return ctx;
};

export const BaseUrlProvider = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return (
    <BaseUrlContext.Provider value={value}>
      {children}
    </BaseUrlContext.Provider>
  );
};
