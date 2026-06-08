import { SignInButton } from './SignInButton'

export type LoginPresentationProps = {
  signInAction: () => Promise<void>
}

export function LoginPresentation({ signInAction }: LoginPresentationProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-8 rounded-2xl bg-white p-10 shadow-sm dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Todos
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access your todo list
          </p>
        </div>

        <form action={signInAction} className="w-full">
          <SignInButton>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign in with Google
          </SignInButton>
        </form>
      </div>
    </div>
  )
}
