import { Heading, HStack, Stack, StackProps } from "@chakra-ui/react"
import { forwardRef, PropsWithChildren } from "react"

type Props = {
  title: string | JSX.Element
  titleRightElement?: JSX.Element
}

const Section = forwardRef(
  (
    {
      title,
      titleRightElement,
      children,
      ...rest
    }: PropsWithChildren<Props & Omit<StackProps, "title">>,
    ref: any
  ): JSX.Element => (
    <Stack ref={ref} w="full" spacing={5} {...rest}>
      {title && <SectionTitle title={title} titleRightElement={titleRightElement} />}
      {children}
    </Stack>
  )
)

const SectionTitle = ({ title, titleRightElement }: Props) => (
  <HStack spacing={2} alignItems="center">
    <Heading
      fontSize={{
        base: "md",
        sm: "lg",
      }}
      as="h3"
      flexShrink="0"
    >
      {title}
    </Heading>
    {titleRightElement}
  </HStack>
)

export default Section
export { SectionTitle }
export type { Props as SectionProps }
