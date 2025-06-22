import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RedirectHandler } from "@/components/auth/redirect-handler";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Server-side redirect for better performance
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signin");
  }

  // This should never be reached due to redirects above,
  // but keeping as fallback for edge cases
  return <RedirectHandler />;
}
