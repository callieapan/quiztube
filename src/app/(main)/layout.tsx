import React from 'react';

import Header from './_components/header';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 container h-screen">{children}</main>
    </>
  );
}
