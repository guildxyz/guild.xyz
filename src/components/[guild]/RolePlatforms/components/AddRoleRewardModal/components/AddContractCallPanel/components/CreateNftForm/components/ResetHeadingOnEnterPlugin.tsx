import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text"
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from "lexical"
import { useEffect } from "react"

function ResetHeadingOnEnterPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const enterListener = (event) => {
      if (!event.shiftKey) return false
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode()
          const parent = node.getParent()

          if (node.__type === "text" && parent.__type === "heading") {
            const headingParent = node.getParent() as HeadingNode
            if (parent.getChildren().length >= 2) {
              parent.getLastChild().remove() // Remove the new text node after the new line break
              parent.getLastChild().remove() // Remove the new line break
            }

            const headingNode = $createHeadingNode(headingParent.__tag)
            const textNode = $createTextNode(node.getTextContent())
            headingNode.append(textNode)
            parent.insertAfter(headingNode)

            headingNode.selectStart()
          }
          if (node.__type === "heading") {
            const paragraphNode = $createParagraphNode()
            selection.insertNodes([paragraphNode])
          }
        }
      })

      return false
    }

    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      enterListener,
      COMMAND_PRIORITY_LOW
    )
  }, [editor])

  return null
}

export default ResetHeadingOnEnterPlugin
