import { Center, Flex, Icon, ModalBody } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { XCircle } from "phosphor-react"
import { PropsWithChildren } from "react"
import InfoModalFooter from "./InfoModalFooter"

const TxError = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <CardMotionWrapper>
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

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default TxError
