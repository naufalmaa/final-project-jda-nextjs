// app/layout.tsx
import './ui/global.css'
import Providers from './Providers' // Pastikan path-nya sesuai


export const metadata = {
  title: 'ArahSekolah',
  description: 'Aplikasi untuk mereview dan menilai sekolah',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
