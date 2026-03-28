"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface ButtonLinkProps
  extends VariantProps<typeof buttonVariants>,
    Omit<React.ComponentProps<typeof Link>, "className"> {
  className?: string;
}

export function ButtonLink({
  href,
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
