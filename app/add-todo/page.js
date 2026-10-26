import AddTodoPage from "@/components/templates/AddTodoPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { isGuestRequest } from "@/utils/guestServer";

export default async function AddTodo() {
  const session = await getServerSession(authOptions);
  if (!session && !isGuestRequest()) redirect("/login");

  return <AddTodoPage />;
}
