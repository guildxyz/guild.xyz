import { cn } from "@/lib/utils"
import useIsStuck from "hooks/useIsStuck"
import { useAtom } from "jotai"
import { PropsWithChildren } from "react"
import { LayoutContainer } from "./Layout"
import { isStickyActionStuckAtom } from "./[guild]/constants"

const StickyAction = ({ children }: PropsWithChildren) => {
  const [isStickyActionStuck, setIsStickyActionStuck] = useAtom(
    isStickyActionStuckAtom
  )
  const { ref } = useIsStuck(setIsStickyActionStuck)

  return (
    <>
      <DesktopHeaderBar isOpen={isStickyActionStuck}>{children}</DesktopHeaderBar>
      <div
        ref={ref}
        className={cn(
          "max-sm:fixed max-sm:right-0 max-sm:bottom-0 max-sm:left-0 max-sm:z-10 max-sm:border-t max-sm:bg-card max-sm:shadow-2xl",
          "sm:sticky sm:top-3"
        )}
      >
        {children}
      </div>
    </>
  )
}

const DesktopHeaderBar = ({
  children,
  isOpen,
}: PropsWithChildren<{ isOpen: boolean }>) => (
  <div
    className={cn(
      "fixed inset-x-0 top-0 z-10 h-0 bg-card shadow-md transition-all duration-200 max-sm:hidden dark:bg-background",
      {
        "sm:h-16": isOpen,
      }
    )}
  >
    <LayoutContainer
      className={cn(
        "flex h-full max-w-screen-xl items-center justify-end sm:hidden",
        {
          "sm:flex": isOpen,
        }
      )}
    >
      {children}
    </LayoutContainer>
  </div>
)

export { StickyAction }
