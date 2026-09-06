"use client";

import {
  forwardRef,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-sm text-sm font-medium tracking-tight",
    "transition-[background-color,color,border-color,box-shadow,opacity,transform] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-45",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-[1.04] active:brightness-[0.97]",
        secondary:
          "bg-[var(--accent-soft)] text-[var(--accent)] hover:brightness-[0.98]",
        ghost:
          "bg-transparent text-[var(--foreground)] underline-offset-4 hover:underline hover:decoration-[var(--accent)]",
        outline:
          "border border-[var(--border-strong)] border-dashed bg-transparent text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        ink: "bg-transparent text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-10 px-5",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type VariantProps_ = VariantProps<typeof buttonVariants>;

type ButtonAsButton = VariantProps_ &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    children?: ReactNode;
  };

type ButtonAsLink = VariantProps_ &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    children?: ReactNode;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const { className, variant, size, children } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && typeof props.href === "string") {
    const { href, variant: _v, size: _s, className: _c, ...linkProps } = props;
    return (
      <Link
        href={href}
        className={classes}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    type = "button",
    ...buttonProps
  } = props as ButtonAsButton;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

type MagneticButtonProps = ButtonProps & {
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  strength = 8,
  variant,
  size,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const max = Math.min(strength, 8);
    x.set(Math.max(-max, Math.min(max, offsetX * 0.28)));
    y.set(Math.max(-max, Math.min(max, offsetY * 0.28)));
  };

  const classes = cn(buttonVariants({ variant, size }), className);
  const href = "href" in props ? props.href : undefined;

  const magneticProps = {
    ref: ref as React.RefObject<HTMLAnchorElement & HTMLButtonElement>,
    className: classes,
    onMouseMove: onMove,
    onMouseLeave: reset,
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-flex">
      {href ? (
        <Link href={href} {...magneticProps}>
          {children}
        </Link>
      ) : (
        <button type="button" {...magneticProps}>
          {children}
        </button>
      )}
    </motion.div>
  );
}

export { buttonVariants };
