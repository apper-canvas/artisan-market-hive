import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary hover:shadow-lg focus:ring-primary",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    accent: "bg-gradient-to-r from-accent to-accent/90 text-white hover:from-accent/90 hover:to-accent hover:shadow-lg focus:ring-accent",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    link: "text-primary hover:text-primary/80 underline-offset-4 hover:underline focus:ring-primary"
  };
  
  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
    xl: "text-lg px-8 py-4 rounded-xl"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;