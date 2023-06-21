import { Heading, HStack, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
  titleRightElement?: JSX.Element
}

const Section = ({
  title,
  titleRightElement,
  children,
}: PropsWithChildren<Props>) => (
  <Stack spacing={4}>
    <HStack spacing={2} w="max-content">
      <Heading w="full" as="h3" fontFamily="display" fontSize="2xl">
        {title}
      </Heading>

      {titleRightElement}
    </HStack>

    {children}
  </Stack>
)

export default Section
