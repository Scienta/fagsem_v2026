const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white',
  secondary: 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-stone-100 text-stone-600',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
