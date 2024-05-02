import { Link } from "@chakra-ui/next-js"
import {
  Box,
  Code,
  Heading,
  Img,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import { forwardRef } from "react"
import ReactMarkdown from "react-markdown"
import { SpecialComponents } from "react-markdown/lib/ast-to-react"
import { NormalComponents } from "react-markdown/lib/complex-types"
import { ensureUrlProtocol } from "utils/ensureUrlProtocol"

export const reactMarkdownComponents: Partial<
  Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
  a: ({ href, children, ...props }) => (
    <Link
      href={ensureUrlProtocol(href)}
      isExternal
      colorScheme="blue"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      {...props}
    >
      {children}
    </Link>
  ),
  h1: ({ children, node: _node, ...props }) => (
    <Heading as="h1" fontSize="2xl" mb={3} mt={4} whiteSpace={"pre-wrap"} {...props}>
      {children}
    </Heading>
  ),
  h2: ({ children, node: _node, ...props }) => (
    <Heading as="h2" fontSize="lg" mb={3} mt={4} whiteSpace={"pre-wrap"} {...props}>
      {children}
    </Heading>
  ),
  code: ({ children, node: _node, ...props }) => (
    <Code display="block" px={4} py={2} mb={4} {...props}>
      {children}
    </Code>
  ),
  p: ({ children, node: _node, ...props }) => (
    <Text display="block" mb={3} whiteSpace={"pre-wrap"} {...props}>
      {children}
    </Text>
  ),
  img: ({ children, node: _node, ...props }) => (
    <Img borderRadius="lg" mb={8} maxW="full" mx="auto" {...props}>
      {children}
    </Img>
  ),
  ul: ({ children, node: _node, ...props }) => (
    <UnorderedList pl={2} mb={4} {...props}>
      {children}
    </UnorderedList>
  ),
  ol: ({ children, node: _node, ...props }) => (
    <OrderedList pl={2} mb={4} {...props}>
      {children}
    </OrderedList>
  ),
  li: ({ children, node: _node, ...props }) => (
    <ListItem whiteSpace={"pre-wrap"} {...props}>
      {children}
    </ListItem>
  ),
  blockquote: ({ children, node: _node, ...props }) => (
    <Box as="blockquote" fontStyle="italic" whiteSpace={"pre-wrap"} {...props}>
      {children}
    </Box>
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
