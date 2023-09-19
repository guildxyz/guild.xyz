import {
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import Button from "components/common/Button"
import { ImageSquare } from "phosphor-react"
import { useState } from "react"
import { INSERT_IMAGE_COMMAND } from "../../ImagesPlugin"

const ImageEditor = (): JSX.Element => {
  const [editor] = useLexicalComposerContext()

  const { isOpen, onToggle, onClose } = useDisclosure()

  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  const clearAndClose = () => {
    setImageUrl("")
    setImageAlt("")
    onClose()
  }

  const addImage = () => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: imageUrl,
      altText: imageAlt,
    })
    clearAndClose()
  }

  return (
    <>
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement="top"
      >
        <PopoverTrigger>
          <IconButton
            onClick={onToggle}
            aria-label="Add image"
            icon={<ImageSquare />}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader
            px={2}
            pt={2}
            pb={0}
            fontWeight="semibold"
            fontSize="sm"
            border="none"
          >
            Add image
          </PopoverHeader>

          <PopoverBody px={2}>
            <Stack>
              <Input
                size="sm"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Input
                size="sm"
                placeholder="Alternate text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </Stack>
          </PopoverBody>

          <PopoverFooter border="none">
            <HStack justifyContent="end">
              <Button onClick={clearAndClose} size="xs" rounded="lg">
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={addImage}
                isDisabled={!imageUrl}
                variant="solid"
                size="xs"
                rounded="lg"
              >
                Add image
              </Button>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default ImageEditor
