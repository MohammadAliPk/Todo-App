import HomePage from "@/components/templates/HomePage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { isGuestRequest } from "@/utils/guestServer";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session && !isGuestRequest()) redirect("/login");

  return <HomePage />;
}
