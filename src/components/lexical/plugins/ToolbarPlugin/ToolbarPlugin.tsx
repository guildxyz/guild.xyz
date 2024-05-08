import {
  ButtonGroup,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text"
import { $isAtNodeEnd, $wrapNodes } from "@lexical/selection"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import Button from "components/common/Button"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Check,
  Code,
  IconProps,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextHOne,
  TextHTwo,
  TextItalic,
  TextT,
} from "phosphor-react"
import { useCallback, useEffect, useRef, useState } from "react"
import ImageEditor from "./components/ImageEditor"
import LinkEditor from "./components/LinkEditor"

export const LOW_PRIORITY = 1

const supportedBlockTypes = [
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol",
] as const

type BlockType = (typeof supportedBlockTypes)[number]

const blockTypeToBlockName: Record<BlockType, string> = {
  h1: "Large Heading",
  h2: "Small Heading",
  ul: "Bullet List",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  code: "Code",
}

const blockTypeToBlockIcon: Record<
  BlockType,
  React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
> = {
  h1: TextHOne,
  h2: TextHTwo,
  ul: ListBullets,
  ol: ListNumbers,
  paragraph: TextT,
  quote: Quotes,
  code: Code,
}

export const getSelectedNode = (selection) => {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()

  if (anchorNode === focusNode) {
    return anchorNode
  }

  const isBackward = selection.isBackward()

  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

const BlockOptionsMenuList = ({
  editor,
  blockType,
}: {
  editor: LexicalEditor
  blockType: string
}) => {
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
  }

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"))
        }
      })
    }
  }

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"))
        }
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, null)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, null)
    }
  }

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, null)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, null)
    }
  }

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode())
        }
      })
    }
  }

  return (
    <MenuList fontSize="sm">
      <MenuItem
        icon={<blockTypeToBlockIcon.paragraph />}
        onClick={formatParagraph}
        {...(blockType === "paragraph" && {
          isDisabled: true,
          command: (<Check />) as any,
        })}
      >
        {blockTypeToBlockName.paragraph}
      </MenuItem>
      <MenuItem
        icon={<blockTypeToBlockIcon.h1 />}
        onClick={formatLargeHeading}
        {...(blockType === "h1" && {
          isDisabled: true,
          command: (<Check />) as any,
        })}
      >
        {blockTypeToBlockName.h1}
      </MenuItem>
      <MenuItem
        icon={<blockTypeToBlockIcon.h2 />}
        onClick={formatSmallHeading}
        {...(blockType === "h2" && {
          isDisabled: true,
          command: (<Check />) as any,
        })}
      >
        {blockTypeToBlockName.h2}
      </MenuItem>
      <MenuItem
        icon={<blockTypeToBlockIcon.ul />}
        onClick={formatBulletList}
        {...(blockType === "ul" && {
          isDisabled: true,
          command: (<Check />) as any,
        })}
      >
        {blockTypeToBlockName.ul}
      </MenuItem>
      <MenuItem
        icon={<blockTypeToBlockIcon.ol />}
        onClick={formatNumberedList}
        {...(blockType === "ol" && {
          isDisabled: true,
          command: (<Check />) as any,
        })}
      >
        {blockTypeToBlockName.ol}
      </MenuItem>
      <MenuItem
        icon={<blockTypeToBlockIcon.quote />}
        onClick={formatQuote}
        {...(blockType === "quote" && {
          isDisabled: true,
          command: (<Check />) as any,
        })}
      >
        {blockTypeToBlockName.quote}
      </MenuItem>
    </MenuList>
  )
}

const ToolbarPlugin = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700")

  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [blockType, setBlockType] = useState<BlockType>("paragraph")
  const [, setSelectedElementKey] = useState(null)
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [, setIsCode] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList ? parentList.getTag() : element.getTag()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
          setBlockType(type as BlockType)
        }
      }

      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsCode(selection.hasFormat("code"))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
  }, [editor])

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateToolbar()
          })
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (_payload, _) => {
            updateToolbar()
            return false
          },
          LOW_PRIORITY
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload)
            return false
          },
          LOW_PRIORITY
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload)
            return false
          },
          LOW_PRIORITY
        )
      ),
    [editor, updateToolbar]
  )

  const {
    isOpen: isLinkEditorOpen,
    onOpen: onLinkEditorOpen,
    onClose: onLinkEditorClose,
  } = useDisclosure()

  const insertLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)

    if (!isLink) {
      onLinkEditorOpen()
    } else {
      onLinkEditorClose()
    }
  }, [editor, isLink, onLinkEditorOpen, onLinkEditorClose])

  return (
    <ButtonGroup
      ref={toolbarRef}
      isAttached
      size="sm"
      w="full"
      borderTopRadius="lg"
      borderBottomRadius={0}
      bgColor={bgColor}
      sx={{
        "> button": {
          borderRadius: 0,
        },
      }}
      overflow="hidden"
      variant="ghost"
    >
      <IconButton
        isDisabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, null)
        }}
        aria-label="Undo"
        icon={<ArrowCounterClockwise />}
      />
      <IconButton
        isDisabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, null)
        }}
        aria-label="Redo"
        icon={<ArrowClockwise />}
      />

      {supportedBlockTypes.includes(blockType) && (
        <Menu size="sm" autoSelect={false}>
          <MenuButton
            as={Button}
            leftIcon={<Icon as={blockTypeToBlockIcon[blockType]} />}
            fontSize="xs"
          >
            {blockTypeToBlockName[blockType]}
          </MenuButton>
          <BlockOptionsMenuList editor={editor} blockType={blockType} />
        </Menu>
      )}

      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }}
        isActive={isBold}
        isDisabled={isItalic}
        aria-label="Format Bold"
        icon={<TextBolder />}
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }}
        isActive={isItalic}
        isDisabled={isBold}
        aria-label="Format Italics"
        icon={<TextItalic />}
      />

      <LinkEditor
        insertLink={insertLink}
        isOpen={isLinkEditorOpen}
        onOpen={onLinkEditorOpen}
        onClose={onLinkEditorClose}
      />

      <ImageEditor />
    </ButtonGroup>
  )
}

export default ToolbarPlugin
