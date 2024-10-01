import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useDisclosure } from "@/hooks/useDisclosure"
import { useMeasure } from "@/hooks/useMeasure"
import { cn } from "@/lib/utils"
import { ArrowDown } from "@phosphor-icons/react/dist/ssr"
import { HTMLAttributes } from "react"
import parseDescription from "utils/parseDescription"

const MAX_INITIAL_DESCRIPTION_HEIGHT = 192 // 12rem

interface Props extends Pick<HTMLAttributes<HTMLDivElement>, "inert" | "className"> {
  description: string
}

const RoleDescription = ({ description, className, ...props }: Props) => {
  const { ref, bounds } = useMeasure<HTMLDivElement>()

  const shouldShowViewMoreButton =
    !!bounds && bounds.height > MAX_INITIAL_DESCRIPTION_HEIGHT
  const { isOpen, onToggle } = useDisclosure()

  return (
    <div
      className={cn(
        // Defining an initial max height to avoid a jump on initial load
        "group relative max-h-[12rem] overflow-hidden px-5 pb-3 transition-all",
        className
      )}
      style={
        shouldShowViewMoreButton
          ? {
              height: isOpen ? bounds.height : MAX_INITIAL_DESCRIPTION_HEIGHT,
              maxHeight: "none",
            }
          : undefined
      }
      {...props}
    >
      <div ref={ref}>{parseDescription(description)}</div>

      {shouldShowViewMoreButton && (
        <div
          className={cn(
            "absolute bottom-0 left-0 flex w-full justify-center break-words bg-gradient-to-t from-black/10 to-transparent pb-2 transition-colors dark:from-black/25",
            {
              "from-transparent dark:from-transparent": isOpen,
            }
          )}
        >
          <Card className="opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="xs"
              onClick={() => onToggle()}
              rightIcon={
                <ArrowDown
                  weight="bold"
                  className={cn({
                    "-rotate-180": isOpen,
                  })}
                />
              }
            >
              {isOpen ? "Collapse" : "Click to expand"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export { RoleDescription }
