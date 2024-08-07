import { cn } from "@/lib/utils"
import useIsStuck from "hooks/useIsStuck"
import { PropsWithChildren } from "react"
import { LayoutContainer } from "../Layout"

const StickyAction = ({ children }: PropsWithChildren) => {
  const { ref, isStuck } = useIsStuck()

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-10 h-0 bg-card shadow-md transition-all duration-200 dark:bg-background",
          {
            "h-16": isStuck,
          }
        )}
      >
        <LayoutContainer
          className={cn("my-3 hidden items-center justify-end", {
            flex: isStuck,
          })}
        >
          {children}
        </LayoutContainer>
      </div>
      <div
        ref={ref}
        className={cn("-mt-4 sticky top-3 ml-auto flex items-center gap-2", {
          "opacity-0": isStuck,
        })}
      >
        {children}
      </div>
    </>
  )
}

export { StickyAction }
