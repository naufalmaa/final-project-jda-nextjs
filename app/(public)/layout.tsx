// app/layout.tsx
import "@/app/globals.css";

export const metadata = {
  title: 'ArahSekolah',
  description: 'Aplikasi Pencarian Sekolah daerah Bandung',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
