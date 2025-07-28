// app/layout.tsx
import { ReactNode } from 'react';
import './globals.css'; // Adjust path if your CSS file is elsewhere

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}