import {
  Center,
  Divider,
  Flex,
  ModalBody,
  ModalFooter,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import TransactionLink from "./TransactionLink"
import TransactionModalCloseButton from "./TransactionModalCloseButton"

const TxInProgress = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <>
    <ModalBody>
      <Flex direction="column">
        <Center mb={10}>
          <Spinner thickness="10px" speed="0.8s" color="blue.500" size="2xl" />
        </Center>
      </Flex>

      <Text mb={2}>
        The blockchain is working its magic... Your transaction should be confirmed
        shortly
      </Text>

      <TransactionLink />

      <Divider mb="6" />

      {children}
    </ModalBody>

    <ModalFooter>
      <TransactionModalCloseButton />
    </ModalFooter>
  </>
)

export default TxInProgress
