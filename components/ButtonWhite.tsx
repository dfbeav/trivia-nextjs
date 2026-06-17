type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode,
  uppercase?: boolean,
  bold?: boolean,
}

export default function ButtonWhite({ children, uppercase, bold, ...props }: ButtonProps) {
  return (
    <button {...props} className={`px-6 py-3 cursor-pointer rounded-full bg-white text-blue-900 ${bold ? 'font-bold' : ''} hover:bg-white/90 transition ${uppercase ? 'uppercase' : ''}`}>
      {children}
    </button>
  )
}