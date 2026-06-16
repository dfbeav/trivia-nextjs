type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  uppercase?: boolean;
  size?: 'small' | 'medium' | 'large';
  bold?: boolean;
};

export default function ButtonGlass({ children, uppercase, size = 'medium', bold = false, ...props }: ButtonProps) {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button 
      className={`cursor-pointer rounded-full bg-black/20 backdrop-blur-sm border border-black/30 text-white ${bold ? 'font-bold' : 'font-normal'} hover:bg-black/90 transition ${uppercase ? 'uppercase' : ''} ${sizeClasses[size]}`} 
      {...props}
      >
      {children}
    </button>
  )
}