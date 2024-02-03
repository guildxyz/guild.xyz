import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createParagraphNode,
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
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode()
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
