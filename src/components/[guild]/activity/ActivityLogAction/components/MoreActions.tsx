import {
  Box,
  HStack,
  Icon,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { ArrowSquareOut, DotsThree } from "phosphor-react"
import { memo } from "react"
import { FixedSizeList } from "react-window"
import { ActivityLogAction } from "../../constants"
import { ActivityLogActionProvider } from "../ActivityLogActionContext"
import ActionIcon from "./ActionIcon"
import ActionLabel from "./ActionLabel"

type Props = {
  actions: ActivityLogAction[]
  displayedActionCount: number
}

const MoreActions = ({ actions, displayedActionCount }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const numberOfAdditionalActions = actions.length - displayedActionCount

  const Row = memo(({ index, style }: { index: number; style: any }) => {
    const action = actions[index]

    return (
      <ListItem style={style}>
        <ActivityLogActionProvider key={action.id} action={action}>
          <Box
            overflowX="auto"
            px={4}
            className="invisible-scrollbar"
            style={{
              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)`,
            }}
          >
            <HStack spacing={4} w="max-content">
              <ActionIcon size={6} />
              <Stack spacing={0.5}>
                <ActionLabel />
                <Text as="span" colorScheme="gray" fontSize="sm">
                  {new Date(Number(action.timestamp)).toLocaleString()}
                </Text>
              </Stack>
            </HStack>
          </Box>
        </ActivityLogActionProvider>
      </ListItem>
    )
  })

  return (
    <>
      <HStack>
        <Icon as={DotsThree} boxSize={6} />
        <Text as="span" fontWeight="semibold">
          {`${numberOfAdditionalActions} more action${
            numberOfAdditionalActions > 1 ? "s" : ""
          }`}
        </Text>
        <Button rightIcon={<Icon as={ArrowSquareOut} />} size="sm" onClick={onOpen}>
          View all
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All actions</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <UnorderedList mx={-4}>
              <FixedSizeList
                height={400}
                itemCount={actions.length}
                itemSize={56}
                className="custom-scrollbar"
              >
                {Row}
              </FixedSizeList>
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default MoreActions
