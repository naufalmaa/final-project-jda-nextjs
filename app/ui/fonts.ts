import { Inter } from 'next/font/google';
import { Lusitana } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });
export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'], // kamu bisa sesuaikan bobot yang dibutuhkan
  variable: '--font-lusitana',
});