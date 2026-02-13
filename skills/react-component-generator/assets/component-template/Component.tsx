import { forwardRef } from 'react';

// ============ Types ============

interface ComponentProps {
  /** Primary content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

// ============ Component ============

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ children, className, disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = 'Component';

export default Component;
