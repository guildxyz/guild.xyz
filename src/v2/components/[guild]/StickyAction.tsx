import { cn } from "@/lib/utils"
import useIsStuck from "hooks/useIsStuck"
import { useAtom } from "jotai"
import { PropsWithChildren } from "react"
import { LayoutContainer } from "../Layout"
import { isStickyActionStuckAtom } from "./constants"

const StickyAction = ({ children }: PropsWithChildren) => {
  const [isStickyActionStuck, setIsStickyActionStuck] = useAtom(
    isStickyActionStuckAtom
  )
  const { ref } = useIsStuck(setIsStickyActionStuck)

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-10 h-0 bg-card shadow-md transition-all duration-200 dark:bg-background",
          {
            "sm:h-16": isStickyActionStuck,
          }
        )}
      >
        <LayoutContainer
          className={cn("flex h-full items-center justify-end sm:hidden", {
            "sm:flex": isStickyActionStuck,
          })}
        >
          {children}
        </LayoutContainer>
      </div>
      <div
        ref={ref}
        className={cn("-mt-4 sticky top-3 ml-auto flex items-center gap-2", {
          "opacity-0": isStickyActionStuck,
        })}
      >
        {children}
      </div>
    </>
  )
}

export { StickyAction }
