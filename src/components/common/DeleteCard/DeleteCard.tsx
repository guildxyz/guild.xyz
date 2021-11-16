import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useHall from "components/[hall]/hooks/useHall"
import usePersonalSign from "hooks/usePersonalSign"
import { TrashSimple } from "phosphor-react"
import { useRef, useState } from "react"
import Card from "../Card"
import Section from "../Section"
import useDelete from "./hooks/useDelete"

const DeleteCard = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [keepDC, setKeepDC] = useState(false)
  const hall = useHall()
  const guild = useGuild()
  const { onSubmit, isLoading } = useDelete(
    hall?.id ? "hall" : "guild",
    hall?.id || guild?.id
  )
  const { isSigning } = usePersonalSign()

  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <Card p="8" w="full">
      <Section title="Danger zone" alignItems="flex-start">
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onOpen}
          leftIcon={<Icon as={TrashSimple} />}
        >
          {`Delete ${hall?.id ? "hall" : "guild"}`}
        </Button>
        <AlertDialog
          motionPreset={transition}
          leastDestructiveRef={cancelRef}
          {...{ isOpen, onClose }}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>{`Delete ${
                hall?.id ? "Hall" : "Guild"
              }`}</AlertDialogHeader>
              <AlertDialogBody>
                <Text>Are you sure? You can't undo this action afterwards.</Text>
                {guild && (
                  <>
                    <Checkbox
                      mt="6"
                      colorScheme="primary"
                      isChecked={keepDC}
                      onChange={(e) => setKeepDC(e.target.checked)}
                    >
                      Keep role and channel on Discord
                    </Checkbox>
                    <Text ml="6" mt="1" colorScheme="gray">
                      This way it'll remain as is for the existing members, but won't
                      be managed anymore
                    </Text>
                  </>
                )}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={isLoading || isSigning}
                  onClick={() => onSubmit({ deleteFromDiscord: !keepDC })}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Section>
    </Card>
  )
}

export default DeleteCard
