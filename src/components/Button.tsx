type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`cursor-pointer ${className}`} {...props}>
      {children}
    </button>
  )
}
