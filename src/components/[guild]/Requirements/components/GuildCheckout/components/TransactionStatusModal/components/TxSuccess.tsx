import {
  Center,
  Divider,
  Flex,
  Icon,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import { CheckCircle } from "phosphor-react"
import { PropsWithChildren } from "react"
import TransactionLink from "./TransactionLink"
import TransactionModalCloseButton from "./TransactionModalCloseButton"

const TxSuccess = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const isMember = useIsMember()
  const openJoinModal = useOpenJoinModal()

  return (
    <>
      <ModalBody>
        <Flex direction="column">
          <Center mb={10}>
            <Icon
              as={CheckCircle}
              boxSize={36}
              color="green.500"
              sx={{
                "> *": {
                  strokeWidth: "8px",
                },
              }}
            />
          </Center>
        </Flex>

        <Text mb={2}>
          {isMember
            ? "Transaction successful! Your access is being rechecked."
            : "Transaction successful! Join the Guild now to get access"}
        </Text>

        <TransactionLink />

        <Divider mb="6" />

        {children}
      </ModalBody>

      <ModalFooter>
        {isMember ? (
          <TransactionModalCloseButton />
        ) : (
          <Button size="lg" colorScheme={"green"} w="full" onClick={openJoinModal}>
            Join guild
          </Button>
        )}
      </ModalFooter>
    </>
  )
}

export default TxSuccess
