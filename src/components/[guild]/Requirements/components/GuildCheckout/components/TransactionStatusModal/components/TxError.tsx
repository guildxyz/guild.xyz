import { Center, Flex, Icon, ModalBody, ModalFooter } from "@chakra-ui/react"
import { XCircle } from "phosphor-react"
import { PropsWithChildren } from "react"
import TransactionModalCloseButton from "./TransactionModalCloseButton"

const TxError = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <>
    <ModalBody pb={0}>
      <Flex direction="column">
        <Center mb={10}>
          <Icon
            as={XCircle}
            boxSize={36}
            color="red.500"
            sx={{
              "> *": {
                strokeWidth: "8px",
              },
            }}
          />
        </Center>
      </Flex>

      {children}
    </ModalBody>

    <ModalFooter>
      <TransactionModalCloseButton />
    </ModalFooter>
  </>
)

export default TxError
