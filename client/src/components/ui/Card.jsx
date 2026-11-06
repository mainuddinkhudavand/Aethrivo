export default function Card({
  children,
  className = '',
  glass = false,
  hover = true,
  ...props
}) {
  return (
    <div
      className={`
        ${glass ? 'card-glass' : 'card'}
        p-6
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
