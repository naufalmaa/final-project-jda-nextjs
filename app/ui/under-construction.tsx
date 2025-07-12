'use client';

import Image from 'next/image';

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <Image
        src="/maintenance-image.png"
        alt="Under Construction"
        width={600}
        height={600}
        className="mb-6"
        priority
      />
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Website Sedang Dalam Pengembangan
      </h1>
      <p className="text-gray-600 text-sm md:text-base">
        Mohon bersabar, kami sedang menyiapkan fitur terbaik untuk Anda. 🚧
      </p>
    </div>
  );
}
