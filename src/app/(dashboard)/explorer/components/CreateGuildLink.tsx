import { buttonVariants } from "@/components/ui/Button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export const CreateGuildLink = () => (
  <Link
    href="/create-guild"
    aria-label="Create guild"
    prefetch={false}
    className={buttonVariants({
      variant: "ghost",
      size: "sm",
      className: "min-h-11 w-11 gap-1.5 px-0 sm:min-h-0 sm:w-auto sm:px-3",
    })}
  >
    <Plus />
    <span className="hidden sm:inline-block">Create guild</span>
  </Link>
);
