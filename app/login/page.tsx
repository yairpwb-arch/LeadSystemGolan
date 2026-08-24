import { loginAction } from "@/lib/actions";
import SubmitButton from "@/app/components/SubmitButton";

export const dynamic = "force-dynamic";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const hasError = searchParams?.error !== undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-center mb-1">
          ניהול לידים
        </h1>
        <p className="text-sm text-muted text-center mb-6">
          הזינו סיסמה כדי להיכנס
        </p>

        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              סיסמה
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="סיסמה"
              className="w-full rounded-lg border border-border px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {hasError && (
            <p className="text-sm text-danger text-center">
              סיסמה שגויה, נסו שוב
            </p>
          )}

          <SubmitButton
            pendingText="מתחבר..."
            className="w-full rounded-lg bg-brand px-3 py-2 text-white font-medium hover:bg-brand-hover transition-colors"
          >
            כניסה
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
