import { ButtonProps, buttonVariants } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"

const SetupPassport = ({ size = "xs" }: { size?: ButtonProps["size"] }) => (
  // We only use this color scheme here, so we haven't made a custom button variant for it
  <a
    className={cn(
      buttonVariants({
        size,
        className:
          "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 dark:active:bg-teal-400 dark:hover:bg-teal-500",
      })
    )}
    href="https://passport.gitcoin.co"
    target="_blank"
  >
    <span>Setup Passport</span>
    <ArrowSquareOut weight="bold" />
  </a>
)

export { SetupPassport }
