import { Center, Flex, ModalBody, Spinner } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { PropsWithChildren } from "react"
import InfoModalFooter from "./InfoModalFooter"

const InProgress = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <CardMotionWrapper>
    <ModalBody>
      <Flex direction="column">
        <Center mb={10}>
          <Spinner thickness="10px" speed="0.8s" color="blue.500" size="2xl" />
        </Center>
      </Flex>

      {children}
    </ModalBody>

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default InProgress
