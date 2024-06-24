import { ReactNode } from "react"

export interface Props {
  children: ReactNode
}

const HeaderSection = ({ children }: Props) => (
  <div className="">{children}</div>
  // <VStack position="relative" alignItems={"center"} spacing={0}>
  //   {children}
  // </VStack>
)

export default HeaderSection
