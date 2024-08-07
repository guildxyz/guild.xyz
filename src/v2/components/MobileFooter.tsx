import { PropsWithChildren } from "react"

const MobileFooter = ({ children }: PropsWithChildren) => (
  <div className="fixed right-0 bottom-0 left-0 sm:relative">
    <div className="w-full border-t bg-card p-4 shadow-2xl sm:w-max sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
      {children}
    </div>
  </div>
)

export { MobileFooter }
