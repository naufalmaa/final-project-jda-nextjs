// import { Card } from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// import { lusitana } from '@/app/ui/fonts';
// import { fetchRevenue } from '@/app/lib/data';
 
// export default async function Page() {
//   const revenue = await fetchRevenue();
//   // ...
// }

import UnderConstruction from '@/app/ui/under-construction';

export default function Page() {
  return (
      <div className="p-6">
    <h1 className="text-2xl font-semibold">Page Utama Home</h1>
      <p>Page Utama Home akan muncul di sini.</p>
      <UnderConstruction />
      </div>
  );
}