import { Center, Flex, Icon, Link, ModalBody, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { XCircle } from "phosphor-react"
import InfoModalFooter from "./InfoModalFooter"

const TxError = (): JSX.Element => (
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

      <Text mb={4}>
        {"Couldn't purchase the assets. Learn about possible reasons here: "}
        <Link
          href="https://support.opensea.io/hc/en-us/articles/7597082600211"
          colorScheme="blue"
          isExternal
        >
          https://support.opensea.io/hc/en-us/articles/7597082600211
        </Link>{" "}
      </Text>
    </ModalBody>

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default TxError
