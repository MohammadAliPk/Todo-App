import { cookies } from "next/headers";
import { GUEST_COOKIE } from "@/utils/guestConstants";

export function isGuestRequest() {
  try {
    return cookies().get(GUEST_COOKIE)?.value === "1";
  } catch {
    return false;
  }
}
