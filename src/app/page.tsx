"use client";

import { authClient } from "@/utils/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

function AuthStatus() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (isPending) {
    return (
      <Card className="w-full max-w-sm animate-pulse">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Checking authentication status</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            Not Signed In
          </CardTitle>
          <CardDescription>
            Sign in to access your account and personalized features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">Guest</Badge>
        </CardContent>
        <CardFooter>
          <Link
            href="/sign-ip"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {session.user.name}
        </CardTitle>
        <CardDescription>{session.user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="default">Signed In</Badge>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={() => authClient.signOut()}
        >
          <LogOut className="size-3" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">SocialDB</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Authentication demo
        </p>
      </div>
      <AuthStatus />
    </div>
  );
}
