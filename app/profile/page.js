import ProfilePage from "@/components/templates/ProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { isGuestRequest } from "@/utils/guestServer";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session && !isGuestRequest()) redirect("/login");

  return <ProfilePage />;
}
