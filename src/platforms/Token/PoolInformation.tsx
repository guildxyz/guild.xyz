import { HStack, Stack, Text } from "@chakra-ui/react"
import { WalletTag } from "components/[guild]/crm/Identities"
import CopyableAddress from "components/common/CopyableAddress"

const PoolInformation = ({
  balance,
  symbol,
  owner,
}: {
  balance: number
  symbol: string
  owner: string
}) => (
  <Stack gap={1}>
    <HStack>
      <Text fontWeight={"semibold"} fontSize="sm">
        Balance
      </Text>
      <Text ml={"auto"} fontSize="sm">
        {balance} {symbol}
      </Text>
    </HStack>
    <HStack>
      <Text fontWeight={"semibold"} fontSize={"sm"}>
        Owner
      </Text>{" "}
      <WalletTag ml={"auto"}>
        <CopyableAddress address={owner} fontSize="sm" />
      </WalletTag>
    </HStack>
  </Stack>
)

export default PoolInformation
