// src/components/dashboard/header.tsx
'use client';

import { useAppSelector } from '@/store/hooks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const user = useAppSelector((state) => state.auth.user);

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}