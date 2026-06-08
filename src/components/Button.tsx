type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const BASE =
  'cursor-pointer rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`${BASE} ${className}`} {...props}>
      {children}
    </button>
  )
}
