import {
  Center,
  Divider,
  Flex,
  Icon,
  Link,
  ModalBody,
  Stack,
  Text,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import InfoModalFooter from "./InfoModalFooter"
import PurchasedRequirementInfo from "./PurchasedRequirementInfo"

type Props = {
  tx: string
}

const Success = ({ tx }: Props): JSX.Element => (
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

      <Text mb={4}>
        The blockchain is working its magic... Your transaction should be confirmed
        shortly
      </Text>

      <Text mb={6} colorScheme="gray">
        {"Transaction id: "}
        <Link isExternal href="" fontWeight="semibold">
          {`${shortenHex(tx, 3)} `}
          <Icon ml={1} as={ArrowSquareOut} />
        </Link>
      </Text>

      <Divider mb={6} />

      <Stack spacing={4}>
        <Text as="span" fontWeight="bold">
          "You'll get:"
        </Text>

        <PurchasedRequirementInfo />
      </Stack>
    </ModalBody>

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default Success
