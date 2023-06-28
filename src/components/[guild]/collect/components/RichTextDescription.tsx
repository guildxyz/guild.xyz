import { Box, Code, Heading, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import { forwardRef } from "react"
import ReactMarkdown from "react-markdown"
import { SpecialComponents } from "react-markdown/lib/ast-to-react"
import { NormalComponents } from "react-markdown/lib/complex-types"

const reactMarkdownComponents: Partial<
  Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
  a: ({ href, children, ...props }) => (
    <Link href={href} isExternal colorScheme="blue" {...props}>
      {children}
    </Link>
  ),
  h1: ({ children, node: _node, ...props }) => (
    <Heading as="h1" fontFamily="display" fontSize="3xl" mb={4} {...props}>
      {children}
    </Heading>
  ),
  h2: ({ children, node: _node, ...props }) => (
    <Heading as="h2" fontFamily="display" fontSize="2xl" mb={4} {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, node: _node, ...props }) => (
    <Heading as="h3" fontFamily="display" fontSize="xl" mb={4} {...props}>
      {children}
    </Heading>
  ),
  h4: ({ children, node: _node, ...props }) => (
    <Heading as="h4" fontFamily="display" fontSize="lg" mb={4} {...props}>
      {children}
    </Heading>
  ),
  h5: ({ children, node: _node, ...props }) => (
    <Heading as="h5" fontFamily="display" fontSize="md" mb={4} {...props}>
      {children}
    </Heading>
  ),
  h6: ({ children, node: _node, ...props }) => (
    <Heading as="h6" fontFamily="display" fontSize="sm" mb={4} {...props}>
      {children}
    </Heading>
  ),
  code: ({ children, node: _node, ...props }) => (
    <Code display="block" px={4} py={2} mb={4} {...props}>
      {children}
    </Code>
  ),
  p: ({ children, node: _node, ...props }) => (
    <Text display="block" mb={4} {...props}>
      {children}
    </Text>
  ),
}

type Props = {
  text: string
}
const RichTextDescription = forwardRef(({ text }: Props, ref: any) => (
  <Box ref={ref} lineHeight={1.75}>
    <ReactMarkdown components={reactMarkdownComponents}>{text}</ReactMarkdown>
  </Box>
))

export default RichTextDescription
