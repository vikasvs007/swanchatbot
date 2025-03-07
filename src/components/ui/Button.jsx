import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-mono",
  {
    variants: {
      variant: {
        default: "bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background hover:shadow-neon-lg shadow-neon",
        destructive: "bg-light-destructive dark:bg-dark-destructive text-light-background dark:text-dark-background hover:shadow-[0_0_15px_theme(colors.light.destructive)]",
        outline: "border-2 border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 hover:shadow-neon",
        secondary: "bg-light-secondary dark:bg-dark-secondary text-light-primary dark:text-dark-primary hover:shadow-neon",
        ghost: "text-light-primary dark:text-dark-primary hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 hover:shadow-neon-sm",
        link: "text-light-primary dark:text-dark-primary underline-offset-4 hover:underline hover:text-light-accent dark:hover:text-dark-accent"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants }; 