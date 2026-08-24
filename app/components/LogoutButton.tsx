import { logoutAction } from "@/lib/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-sm text-muted hover:text-foreground"
      >
        התנתקות
      </button>
    </form>
  );
}
