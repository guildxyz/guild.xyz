import { Box, BoxProps } from "@chakra-ui/react"
import { PropsWithChildren, useRef } from "react"

type Props = PropsWithChildren<
  {
    // image?: JSX.Element
    // imageUrl?: string
    // title?: JSX.Element | string
    // ogTitle?: string
    // ogDescription?: string
    // description?: JSX.Element
    // textColor?: string
    // action?: ReactNode | undefined
    // background?: string
    // backgroundProps?: BoxProps
    // backgroundImage?: string
    // backgroundOffset?: number
    // backButton?: JSX.Element
    // maxWidth?: string
    // showFooter?: boolean
  } & Omit<BoxProps, "title">
>

export const Content = ({ children, ...wrapperProps }: Props) => {
  const childrenWrapper = useRef(null)

  return (
    <Box ref={childrenWrapper} {...wrapperProps}>
      {children}
    </Box>
  )
}
