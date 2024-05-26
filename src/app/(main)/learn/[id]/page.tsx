import React from 'react';

import Image from 'next/image';

export default function LearnPage() {
  const thumbnailUrl = `https://img.youtube.com/vi/tZVZQLyCDfo/maxresdefault.jpg`;

  return (
    <div>
      <Image
        src={thumbnailUrl}
        alt="Quiz Icon"
        layout="responsive"
        width={500}
        height={300}
        objectFit="contain"
        className="object-contain rounded-lg"
      />
    </div>
  );
}
