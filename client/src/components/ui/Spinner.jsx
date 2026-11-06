import { Loader2 } from 'lucide-react';

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-primary-600`}
      />
    </div>
  );
}
