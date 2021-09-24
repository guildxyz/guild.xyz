import { Img, Text, VStack } from "@chakra-ui/react"
import useENSName from "components/common/Layout/components/Account/hooks/useENSName"
import addressAvatarPairs from "constants/avatars/addressAvatarPairs"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const Member = ({ address }: Props): JSX.Element => {
  const ENSName = useENSName(address)

  if (!address) return null

  return (
    <VStack
      spacing={2}
      opacity="0.5"
      transition="opacity .1s"
      _hover={{ opacity: 1 }}
    >
      <Img
        src={`/avatars/${addressAvatarPairs[address.slice(-2)]}.svg`}
        boxSize={{ base: 6, md: 8 }}
      />
      <Text fontFamily="display" fontWeight="semibold" fontSize="sm">
        {ENSName || `${shortenHex(address, 3)}`}
      </Text>
    </VStack>
  )
}

export default Member
