import { Center, Flex, Icon, ModalBody } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { CheckCircle } from "phosphor-react"
import { PropsWithChildren } from "react"
import InfoModalFooter from "./InfoModalFooter"

const Success = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <CardMotionWrapper>
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

      {children}
    </ModalBody>

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default Success
