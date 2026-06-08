type FieldProps = {
  id: string
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Field({ id, label, error, className = '', ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        className={`rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-100/10 ${className}`}
        {...props}
      />
      {error && <p role="alert" className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}
