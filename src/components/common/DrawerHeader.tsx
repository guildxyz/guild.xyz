import { Heading, HStack, StackProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
  leftElement?: JSX.Element
}

const DrawerHeader = ({
  title,
  leftElement,
  children,
  ...stackProps
}: PropsWithChildren<Props> & StackProps): JSX.Element => (
  <HStack justifyContent="space-between" py={2} mb={10} mr="-2" {...stackProps}>
    {leftElement}
    <Heading as="h2" fontSize="24px" fontFamily="display">
      {title}
    </Heading>
    {children}
  </HStack>
)

export default DrawerHeader
