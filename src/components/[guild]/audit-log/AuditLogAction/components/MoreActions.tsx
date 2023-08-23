import {
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
import { FixedSizeList } from "react-window"
import { AuditLogAction } from "../../constants"
import { AuditLogActionProvider } from "../AuditLogActionContext"
import ActionIcon from "./ActionIcon"
import ActionLabel from "./ActionLabel"

type Props = {
  actions: AuditLogAction[]
  displayedActionCount: number
}

const MoreActions = ({ actions, displayedActionCount }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const numberOfAdditionalActions = actions.length - displayedActionCount

  const Row = ({ index, style }) => {
    const action = actions[index]

    return (
      <ListItem style={style}>
        <AuditLogActionProvider key={action.id} action={action}>
          <HStack spacing={4} pointerEvents="all">
            <ActionIcon size={6} />
            <Stack spacing={0.5}>
              <ActionLabel />
              <Text as="span" colorScheme="gray" fontSize="sm">
                {new Date(Number(action.timestamp)).toLocaleString()}
              </Text>
            </Stack>
          </HStack>
        </AuditLogActionProvider>
      </ListItem>
    )
  }

  return (
    <>
      <HStack pt={2}>
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

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All actions</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <UnorderedList ml={0}>
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
