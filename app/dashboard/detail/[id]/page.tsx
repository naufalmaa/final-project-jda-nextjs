// app/dashboard/detail/[id]/page.tsx
import DetailClient from '@/components/dashboard/DetailClient';

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  // await the params object before using its properties
  const { id } = await params;
  return <DetailClient schoolId={id} />;
}
