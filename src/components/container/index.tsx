import { ReactNode, type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <main
      className={`container flex flex-col gap-4 min-h-screen mx-auto max-w-7xl p-4 sm:p-6 sm:gap-6 2xl:p-8 2xl:gap-8 ${className}`}
      {...props}
    >
      {children}
    </main>
  );
}
