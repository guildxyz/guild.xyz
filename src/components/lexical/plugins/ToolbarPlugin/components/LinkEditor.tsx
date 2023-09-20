import {
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import Button from "components/common/Button"
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical"
import { Link } from "phosphor-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { getSelectedNode, LOW_PRIORITY } from "../ToolbarPlugin"

type LinkEditorProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  insertLink: () => void
}

const LinkEditor = ({ isOpen, onOpen, onClose, insertLink }: LinkEditorProps) => {
  const [editor] = useLexicalComposerContext()

  const initialFocusRef = useRef<HTMLInputElement>()
  const [linkUrl, setLinkUrl] = useState("")
  const [lastSelection, setLastSelection] = useState(null)
  const [shouldOpenEditor, setShouldOpenEditor] = useState(false)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
        setShouldOpenEditor(true)
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
        setShouldOpenEditor(true)
      } else {
        setLinkUrl("")
        setShouldOpenEditor(false)
      }
    }

    const nativeSelection = window.getSelection()

    const rootElement = editor.getRootElement()

    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      setLastSelection(selection)
    } else {
      setLastSelection(null)
      setLinkUrl("")
    }

    return true
  }, [editor])

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateLinkEditor()
          })
        }),

        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            updateLinkEditor()
            return true
          },
          LOW_PRIORITY
        )
      ),
    [editor, updateLinkEditor]
  )

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  const addLink = () => {
    if (!lastSelection || !linkUrl) return
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
    onClose()
  }

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      isOpen={isOpen}
      onClose={onClose}
      placement="top"
    >
      <PopoverTrigger>
        <IconButton
          onClick={shouldOpenEditor ? onOpen : insertLink}
          isActive={isOpen}
          aria-label="Insert Link"
          icon={<Link />}
        />
      </PopoverTrigger>

      <PopoverContent>
        <PopoverHeader
          px={2}
          pt={2}
          pb={0}
          fontWeight="semibold"
          fontSize="sm"
          border="none"
        >
          Edit link
        </PopoverHeader>

        <PopoverArrow />
        <PopoverCloseButton />

        <PopoverBody p={2}>
          <HStack>
            <Input
              ref={initialFocusRef}
              size="sm"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(event) => {
                setLinkUrl(event.target.value)
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") addLink()
              }}
            />
            <Button
              size="sm"
              variant="solid"
              flexShrink={0}
              borderRadius="lg"
              onClick={addLink}
              isDisabled={!linkUrl?.length}
            >
              Save
            </Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default LinkEditor
