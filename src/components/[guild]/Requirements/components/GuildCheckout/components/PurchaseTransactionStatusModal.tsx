import { Link, Stack, Text } from "@chakra-ui/react"
import TransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import PurchasedRequirementInfo from "./PurchasedRequirementInfo"

const PurchaseTransactionStatusModal = () => (
  <TransactionStatusModal
    title={"Buy requirement"}
    progressComponent={
      <>
        <Stack spacing={4}>
          <Text as="span" fontWeight="bold">
            You'll get:
          </Text>

          <PurchasedRequirementInfo />
        </Stack>
      </>
    }
    successComponent={
      <>
        <Stack spacing={4}>
          <Text as="span" fontWeight="bold">
            Your new asset:
          </Text>

          <PurchasedRequirementInfo />
        </Stack>
      </>
    }
    errorComponent={
      <Text mb={4}>
        {"Couldn't purchase the assets. Learn about possible reasons here: "}
        <Link
          href="https://support.opensea.io/hc/en-us/articles/7597082600211"
          colorScheme="blue"
          isExternal
        >
          https://support.opensea.io/hc/en-us/articles/7597082600211
        </Link>
      </Text>
    }
  />
)

export default PurchaseTransactionStatusModal
