import { authClient } from "@/utils/auth-client";
import PersonMobile from "./mobile";
import PersonDesktop from "./desktop";

export default function PersonPage() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  // Handle session states
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Get window width for responsive design
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  if (width === 0) {
    return <div>Loading...</div>;
  }

  // Render the mobile component if the window width is less than 768
  if (!isPending && session && width < 768) {
    return <PersonMobile />;
  }

  // Render the desktop component if the window width is greater than or equal to 768
  if (!isPending && session && width >= 768) {
    return <PersonDesktop />;
  }
}
