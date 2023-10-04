import { Stack, Text } from "@chakra-ui/react"
import { CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TextMatchTransformer,
  TRANSFORMERS,
} from "@lexical/markdown"
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from "components/lexical/nodes/ImageNode"
import AutoLinkPlugin from "components/lexical/plugins/AutoLinkPlugin"
import ImagesPlugin from "components/lexical/plugins/ImagesPlugin"
import ToolbarPlugin from "components/lexical/plugins/ToolbarPlugin/ToolbarPlugin"

type Props = {
  onChange?: (value: string) => void
  placeholder?: string
  defaultValue?: string
  minHeight?: string
}

// TODO: proper error handling maybe
const onError = (error) => {
  console.error(error)
}

// Image markdown transformer
const IMAGE: TextMatchTransformer = {
  export: (node, _exportChildren, __exportFormat) => {
    if (!$isImageNode(node)) {
      return null
    }

    return `![${node.getAltText()}](${node.getSrc()})`
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match
    const imageNode = $createImageNode({
      src,
      altText,
    })
    textNode.replace(imageNode)
  },
  trigger: ")",
  type: "text-match",
  dependencies: [],
}

// image transformer must be before the other ones, so we don't accidentally display an image as a link
const MARKDOWN_TRANSFORMERS = [IMAGE, ...TRANSFORMERS]

const RichTextDescriptionEditor = ({
  onChange,
  placeholder,
  defaultValue = "",
  minHeight,
}: Props) => {
  const initialConfig: InitialConfigType = {
    editorState: () =>
      $convertFromMarkdownString(defaultValue, MARKDOWN_TRANSFORMERS),
    namespace: "MyEditor",
    theme: {
      strikethrough: "text-strikethrough",
    },
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      AutoLinkNode,
      LinkNode,
      CodeNode,
      ImageNode,
    ],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Stack spacing={0} borderWidth={1} borderRadius="lg">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="lexical-content-editable"
              style={{
                height: "auto",
                minHeight,
              }}
            />
          }
          placeholder={
            <Text
              colorScheme="gray"
              position="absolute"
              top="calc(var(--chakra-space-10) + 2px)"
              left={3}
            >
              {placeholder}
            </Text>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ImagesPlugin />
      </Stack>

      <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS)
            onChange?.(markdown)
          })
        }}
      />
    </LexicalComposer>
  )
}
export default RichTextDescriptionEditor
