import {
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useIntercom } from "components/_app/IntercomProvider"
import { Chat } from "phosphor-react"

const AlphaTag = () => {
  const { triggerChat } = useIntercom()

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Tag size="sm" position="relative" top={0.5} fontFamily="body">
          Alpha
        </Tag>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody fontFamily="body">
          <Text fontSize="md" fontWeight="normal">
            This feature is still in alpha. If you run into any issues please let us
            know!
          </Text>
          <Flex mt="2" w="full" justifyContent={"right"}>
            <Button size="sm" onClick={triggerChat} leftIcon={<Icon as={Chat} />}>
              Open help center
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default AlphaTag
