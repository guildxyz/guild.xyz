import {
  Center,
  Divider,
  Flex,
  Icon,
  ModalBody,
  Stack,
  Text,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { CheckCircle } from "phosphor-react"
import InfoModalFooter from "./InfoModalFooter"
import PurchasedRequirementInfo from "./PurchasedRequirementInfo"
import TransactionLink from "./TransactionLink"

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
        Requirement successfully purchased! Your access is being rechecked
      </Text>

      <TransactionLink tx={tx} />

      <Divider mb={6} />

      <Stack spacing={4}>
        <Text as="span" fontWeight="bold">
          Your new asset:
        </Text>

        <PurchasedRequirementInfo />
      </Stack>
    </ModalBody>

    <InfoModalFooter />
  </CardMotionWrapper>
)

export default Success
