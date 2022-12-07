import { Heading, HStack, Stack, StackProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string | JSX.Element
  titleRightElement?: JSX.Element
} & Omit<StackProps, "title">

const Section = ({
  title,
  titleRightElement,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack w="full" spacing={5} {...rest}>
    <HStack spacing={2} alignItems="center">
      <Heading
        fontSize={{
          base: "md",
          sm: "lg",
        }}
        as="h3"
      >
        {title}
      </Heading>
      {titleRightElement}
    </HStack>
    {children}
  </Stack>
)

export default Section
export type { Props as SectionProps }
