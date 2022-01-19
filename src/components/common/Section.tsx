import { Heading, HStack, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
  titleRightElement?: JSX.Element
} & Rest

const Section = ({
  title,
  titleRightElement,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5} {...rest}>
    <HStack spacing={2} alignItems="center">
      <Heading fontSize={{ base: "md", sm: "lg" }} as="h3">
        {title}
      </Heading>
      {titleRightElement}
    </HStack>

    {children}
  </Stack>
)

export default Section
export type { Props as SectionProps }
