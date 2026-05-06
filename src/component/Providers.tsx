"use client";

import { SmartImageProvider } from "react-a11y-auto-caption";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmartImageProvider value={{ apiEndpoint: "http://localhost:8000/api/generate-caption" }}>
      {children}
    </SmartImageProvider>
  );
}
