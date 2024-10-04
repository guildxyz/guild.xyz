import { Anchor, AnchorProps, anchorVariants } from "@/components/ui/Anchor"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren, forwardRef } from "react"

type Props = PropsWithChildren<ButtonProps>

const RequirementButton = forwardRef(
  (
    { variant = "unstyled", className, children, ...buttonProps }: Props,
    ref: any
  ) => (
    <Button
      ref={ref}
      size="xs"
      loadingText="Loading..."
      variant={variant}
      className={cn(
        {
          [anchorVariants({ variant: "muted", className: "px-0" })]:
            variant === "unstyled",
        },
        "h-5 rounded-md",
        className
      )}
      {...buttonProps}
    >
      {children}
    </Button>
  )
)

interface LinkProps extends Omit<AnchorProps, "variant"> {
  label: string
  imageUrl: string
  variant?: Omit<ButtonProps["variant"], "unstyled"> | "link"
}

const RequirementLink = ({
  label,
  imageUrl,
  className,
  variant = "link",
  ...anchorProps
}: LinkProps) => (
  <Anchor
    target="_blank"
    rel="noopener"
    className={cn(
      buttonVariants({
        variant:
          variant === "link" ? "unstyled" : (variant as ButtonProps["variant"]),
        size: "xs",
        className: [
          "h-5 rounded-md",
          {
            [anchorVariants({ variant: "muted", className: "px-0" })]:
              variant === "link",
            "hover:no-underline": variant !== "link",
          },
          className,
        ],
      })
    )}
    {...anchorProps}
  >
    <img src={imageUrl} alt="Link image" className="size-3" />
    <span>{label}</span>
    <ArrowSquareOut weight="bold" />
  </Anchor>
)

export { RequirementButton, RequirementLink }
