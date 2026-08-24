import { logoutAction } from "@/lib/actions";
import SubmitButton from "./SubmitButton";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <SubmitButton
        pendingText="מתנתק..."
        className="text-sm text-muted hover:text-foreground"
      >
        התנתקות
      </SubmitButton>
    </form>
  );
}
