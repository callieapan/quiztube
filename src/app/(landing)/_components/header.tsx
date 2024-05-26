'use client';

import React from 'react';

import Link from 'next/link';

import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/client-auth';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/clerk-react';

const ConditionalSignInButton = ({ session }: { session: any }) => (
  <>
    {session.isLoggedIn ? (
      <Button size="sm" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    ) : (
      <Button asChild>
        <SignInButton>Get started</SignInButton>
      </Button>
    )}
  </>
);

export default function Header() {
  const session = useSession();
  return (
    <header
      className={cn(
        'supports-backdrop-blur:bg-background/90 sticky top-0 z-40 w-full  bg-background/40 backdrop-blur-lg',
      )}
    >
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center  gap-2 justify-end">
          <ConditionalSignInButton session={session} />
        </div>
      </div>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0" />
    </header>
  );
}
