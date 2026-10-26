"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailsPage from "./DetailsPage";
import { getGuestTodoById } from "@/utils/guestStorage";

function GuestDetailsPage({ id }) {
  const router = useRouter();
  const [todo, setTodo] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = getGuestTodoById(id);
    if (!found) {
      router.replace("/");
      return;
    }
    setTodo({
      ...found,
      _id: found._id,
      dueDate: found.dueDate
    });
    setReady(true);
  }, [id, router]);

  if (!ready || !todo) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-mute">
        Loading task...
      </div>
    );
  }

  return <DetailsPage data={todo} isGuest />;
}

export default GuestDetailsPage;
