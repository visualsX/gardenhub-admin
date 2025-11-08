export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    transparent: 'bg-white border border-gray-200 rounded-full',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-700',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center rounded font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </div>
  );
}
