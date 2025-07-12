'use client';

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#5cb7c3] text-center px-6">
      <Image
              src="/error-image.jpg"
              alt="Under Construction"
              width={1000}
              height={1000}
              className="mb-6"
              priority
    />
      <a href="/" className="text-black-500 text-3xl underline">Kembali ke Beranda</a>
    </div>
  );
}
