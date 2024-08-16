import { HStack, Heading, Stack, StackProps } from "@chakra-ui/react"
import { PropsWithChildren, forwardRef } from "react"

type Props = {
  title?: string | JSX.Element
  titleRightElement?: JSX.Element
} & Omit<StackProps, "title">

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
    <Stack ref={ref} w="full" spacing={4} {...rest}>
      {(title || titleRightElement) && (
        <SectionTitle title={title} titleRightElement={titleRightElement} />
      )}
      {children}
    </Stack>
  )
)

const SectionTitle = ({ title, titleRightElement, ...rest }: Props) => (
  <HStack spacing={2} alignItems="center">
    {title && (
      <Heading
        fontSize={{
          base: "md",
          sm: "lg",
        }}
        as="h3"
        flexShrink="0"
        {...rest}
      >
        {title}
      </Heading>
    )}
    {titleRightElement}
  </HStack>
)

export default Section
export { SectionTitle }
export type { Props as SectionProps }
