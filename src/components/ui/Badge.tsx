import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-primary-foreground hover:bg-primary-600 shadow-sm",
        secondary: "border-transparent bg-secondary-500 text-secondary-foreground hover:bg-secondary-600 shadow-sm",
        success: "border-transparent bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
        danger: "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "text-text border-gray-300 hover:bg-surface-200",
        ghost: "hover:bg-surface-200 text-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
