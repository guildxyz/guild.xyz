import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cssUtils";
import { Users } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export const RoleCard = ({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "@container rounded-2xl bg-card-secondary p-4 transition-colors hover:cursor-pointer hover:bg-card ",
        className,
      )}
      {...props}
    >
      <div className="flex @lg:flex-row flex-col gap-4">
        <div className="flex @lg:w-1/2 w-full flex-col gap-2">
          <Link href="#" className="w-fit">
            <Badge
              size="lg"
              className="mb-2 @lg:flex hidden whitespace-normal rounded-full text-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              Guild
            </Badge>
          </Link>

          {/* Header */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/banner-light.svg"
              alt="Banner"
              width={100}
              height={100}
              className="aspect-square h-10 w-10 rounded-full border-2 border-whiteAlpha-medium bg-blackAlpha-medium object-cover object-center"
            />
            <div className="flex flex-col overflow-hidden">
              <div className="-mb-1 flex items-center gap-1">
                <p className="truncate font-bold">
                  Guild with a Long F'in Name
                </p>
              </div>
              <small className="flex items-center font-bold opacity-50">
                <Users size={16} weight="bold" className="mr-1 inline-block" />{" "}
                91 owners
              </small>
            </div>
          </div>

          <Link href="#" className="mt-2 block @lg:hidden w-fit">
            <Badge
              className="rounded-full text-sm hover:bg-black/10 dark:hover:bg-white/10"
              size="lg"
            >
              <p className="truncate">Orbiter Finance</p>
            </Badge>
          </Link>

          {/* Description */}
          <p
            className="my-2 opacity-50"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Community management through role-based access control.
          </p>
        </div>
        <div className="flex @lg:w-1/2 w-full @xs:flex-row flex-col gap-3">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-white/5">
            <p>Test</p>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-xl bg-white/5">
            <p>Test</p>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-xl bg-white/5">
            <p>Test</p>
          </div>
        </div>
      </div>
    </div>
  );
};
