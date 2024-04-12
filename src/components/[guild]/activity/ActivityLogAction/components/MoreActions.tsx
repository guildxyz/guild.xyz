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
import { CSSProperties, memo, useEffect, useRef } from "react"
import { VariableSizeList } from "react-window"
import { ActivityLogAction } from "../../constants"
import { ActivityLogActionProvider } from "../ActivityLogActionContext"
import ActionIcon from "./ActionIcon"
import ActionLabel from "./ActionLabel"
import ActivityLogChildAction from "./ActivityLogChildAction"

type Props = {
  actions: ActivityLogAction[]
  displayedActionCount: number
}

const MoreActions = ({ actions, displayedActionCount }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const numberOfAdditionalActions = actions.length - displayedActionCount

  const listRef = useRef(null)
  const rowHeights = useRef<Record<number, number>>({})

  const Row = memo(({ index, style }: { index: number; style: CSSProperties }) => {
    const rowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!rowRef.current) return
      // Recalculating row heights, then setting new row heights
      listRef.current.resetAfterIndex(0)
      rowHeights.current = {
        ...rowHeights.current,
        [index]: rowRef.current.clientHeight + 8,
      }
    }, [rowRef, index])

    const action = actions[index]

    return (
      <ListItem style={style}>
        <ActivityLogActionProvider key={action.id} action={action}>
          <Stack ref={rowRef} spacing={0} py={1}>
            <HStack spacing={4}>
              <ActionIcon size={6} />
              <Stack spacing={0.5}>
                <ActionLabel />
                <Text as="span" colorScheme="gray" fontSize="sm">
                  {new Date(Number(action.timestamp)).toLocaleString()}
                </Text>
              </Stack>
            </HStack>

            <Stack pl={10}>
              {action.children?.map((childAction) => (
                <ActivityLogActionProvider key={childAction.id} action={childAction}>
                  <ActivityLogChildAction />
                </ActivityLogActionProvider>
              ))}
            </Stack>
          </Stack>
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
            <UnorderedList mx={0}>
              <VariableSizeList
                ref={listRef}
                height={400}
                itemCount={actions.length}
                itemSize={(i) => rowHeights.current[i] ?? 0}
                className="custom-scrollbar"
                style={{
                  overflowX: "hidden",
                }}
              >
                {Row}
              </VariableSizeList>
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default MoreActions
