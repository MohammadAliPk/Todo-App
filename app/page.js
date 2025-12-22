import HomePage from "@/components/templates/HomePage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <HomePage />;
}
