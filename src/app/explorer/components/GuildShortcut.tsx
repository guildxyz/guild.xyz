import { cn } from "@/lib/cssUtils";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export const GuildShortcut = ({
  className,
  children,
  href = "#",
  ...props
}: PropsWithChildren<{
  className?: string;
  href?: string;
}>) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-fit flex-col items-center gap-2 rounded-xl p-2 transition-all hover:bg-blackAlpha-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-whiteAlpha-medium",
        className,
      )}
      {...props}
    >
      <Image
        src="/images/banner-light.svg"
        alt="Banner"
        width={100}
        height={100}
        className="aspect-square h-10 w-10 rounded-full border-2 border-whiteAlpha-medium bg-blackAlpha-medium object-cover object-center"
      />

      <p
        className="max-w-16 truncate text-wrap text-center font-bold text-xs"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {children}
      </p>
    </Link>
  );
};
