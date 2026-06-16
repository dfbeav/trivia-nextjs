type ButtonProps = {
  children: React.ReactNode,
  uppercase?: boolean,
}

export default function ButtonWhite({ children, uppercase }: ButtonProps) {
  return (
    <button className={`px-6 py-3 rounded-full bg-white text-blue-900 font-bold hover:bg-white/90 transition ${uppercase ? 'uppercase' : ''}`}>
      {children}
    </button>
  )
}