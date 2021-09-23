import { Img, Text, VStack } from "@chakra-ui/react"
import useENSName from "components/common/Layout/components/Account/hooks/useENSName"
import addressAvatarPairs from "constants/avatars/addressAvatarPairs"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const Member = ({ address }: Props): JSX.Element => {
  const ENSName = useENSName(address)

  return (
    <VStack spacing={2}>
      <Img
        src={`/avatars/${addressAvatarPairs[address.slice(-2)]}.svg`}
        boxSize={10}
      />
      <Text fontFamily="display" fontWeight="semibold" fontSize="sm">
        {ENSName || `${shortenHex(address, 3)}`}
      </Text>
    </VStack>
  )
}

export default Member
