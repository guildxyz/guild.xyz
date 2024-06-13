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

/**
 * Modifies line break functionality in headings.
 *
 * Markdown does not support line breaks in headings. This plugin makes the editor's
 * behavior consistent with markdown, a line break inside a heading creates a new
 * heading line, a line break at the end of a heading creates a new paragraph line.
 */
function HeadingLineBreakPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const enterListener = (event) => {
      if (!event.shiftKey) return false
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode()
          const parent = node.getParent()

          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          if (node.__type === "text" && parent.__type === "heading") {
            const headingParent = node.getParent() as HeadingNode
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            if (parent.getChildren().length >= 2) {
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              parent.getLastChild().remove() // Remove the new text node after the new line break
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              parent.getLastChild().remove() // Remove the new line break
            }

            const headingNode = $createHeadingNode(headingParent.__tag)
            const textNode = $createTextNode(node.getTextContent())
            headingNode.append(textNode)
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
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

export default HeadingLineBreakPlugin
