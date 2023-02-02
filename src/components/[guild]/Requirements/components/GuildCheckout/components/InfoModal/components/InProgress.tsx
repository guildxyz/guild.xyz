import {
  Center,
  Divider,
  Flex,
  ModalBody,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import InfoModalFooter from "./InfoModalFooter"
import PurchasedRequirementInfo from "./PurchasedRequirementInfo"
import TransactionLink from "./TransactionLink"

type Props = {
  tx: string
}

const InProgress = ({ tx }: Props): JSX.Element => (
  <CardMotionWrapper>
    <ModalBody>
      <Flex direction="column">
        <Center mb={10}>
          <Spinner thickness="10px" speed="0.8s" color="blue.500" size="2xl" />
        </Center>
      </Flex>

      <Text mb={4}>
        The blockchain is working its magic... Your transaction should be confirmed
        shortly
      </Text>

      <TransactionLink tx={tx} />

      <Divider mb={6} />

      <Stack spacing={4}>
        <Text as="span" fontWeight="bold">
          You'll get:
        </Text>

        <PurchasedRequirementInfo />
      </Stack>
    </ModalBody>

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default InProgress
