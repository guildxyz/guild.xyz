import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

const RoleRequirementsSection = ({
  isOpen = true,
  children,
}: PropsWithChildren<{ isOpen?: boolean }>) => {
  return (
    <div
      className={cn("flex flex-col border-transparent transition-colors", {
        "border-border border-t bg-card-secondary md:border-t-0 md:border-l": isOpen,
      })}
    >
      {children}
    </div>
  )
}

const RoleRequirementsSectionHeader = ({
  isOpen = true,
  children,
}: PropsWithChildren<{ isOpen?: boolean }>) => (
  <div
    className={cn(
      "mb-4 flex items-center justify-between p-5 pb-0 transition-transform md:mb-6",
      {
        "translate-y-2": !isOpen,
      }
    )}
  >
    <span
      className={cn(
        "pointer-events-none mt-1 mr-2 text-ellipsis font-bold text-muted-foreground text-xs uppercase opacity-0 transition-opacity",
        {
          "pointer-events-auto opacity-100": isOpen,
        }
      )}
    >
      Unlock rewards
    </span>
    {children}
  </div>
)

export { RoleRequirementsSection, RoleRequirementsSectionHeader }
