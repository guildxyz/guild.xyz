import { Stack } from "@chakra-ui/react"
import { CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"
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
import AutoLinkPlugin from "components/lexical/plugins/AutoLinkPlugin"
import ToolbarPlugin from "components/lexical/plugins/ToolbarPlugin"

type Props = {
  onChange?: (value: string) => void
}

// TODO: proper error handling maybe
const onError = (error) => {
  console.error(error)
}

const RichTextDescriptionEditor = ({ onChange }: Props) => {
  const initialConfig: InitialConfigType = {
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
    ],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Stack spacing={0} borderWidth={1} borderRadius="lg">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="lexical-content-editable" />}
          placeholder={undefined}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </Stack>

      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS)
            onChange?.(markdown)
          })
        }}
      />
    </LexicalComposer>
  )
}
export default RichTextDescriptionEditor
