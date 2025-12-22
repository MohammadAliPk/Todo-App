import LoginPage from "@/components/templates/LoginPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return <LoginPage />;
}
