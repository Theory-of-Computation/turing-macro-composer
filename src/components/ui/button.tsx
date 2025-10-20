import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-lg shadow-primary/20 focus-visible:ring-primary",
        secondary:
          "bg-slate-800 text-white shadow-lg shadow-slate-900/20 focus-visible:ring-slate-200 dark:bg-slate-100 dark:text-slate-900",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
        outline:
          "border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
      },
      size: {
        sm: "px-3 py-1 text-xs md:px-4 md:py-2 md:text-sm",
        md: "px-5 py-2 text-sm md:px-6 md:py-3 md:text-base xl:px-7 xl:py-3 xl:text-lg",
        lg: "px-6 py-3 text-base md:px-8 md:py-3.5 md:text-lg xl:px-10 xl:py-4 xl:text-xl",
        icon: "p-2 text-sm md:p-2.5"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = ({ className, variant, size, asChild, ...props }: ButtonProps) => {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};
