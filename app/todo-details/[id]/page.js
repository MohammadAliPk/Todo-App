import DetailsPage from "@/components/templates/DetailsPage";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getTodo(id) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return { redirect: "/login" };

  const user = await User.findOne({ email: session.user.email });
  if (!user) return { redirect: "/login" };

  const todo = user.todos.find(i => String(i._id) === id);
  if (!todo) return { redirect: "/" };

  return { todo: JSON.parse(JSON.stringify(todo)) };
}

export default async function TodoDetails({ params }) {
  const result = await getTodo(params.id);
  if (result.redirect) redirect(result.redirect);

  return <DetailsPage data={result.todo} />;
}
