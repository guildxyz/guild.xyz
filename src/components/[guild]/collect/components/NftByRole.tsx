import { HStack, Icon, Text } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { Users } from "phosphor-react"
import { Role } from "types"

type Props = {
  role: Role
}

const NftByRole = ({ role }: Props) => (
  <HStack pb={2}>
    <Text as="span">by Role:</Text>
    <HStack>
      <GuildLogo imageUrl={role?.imageUrl} size={6} />
      <Text as="span" fontWeight="bold">
        Member
      </Text>
    </HStack>

    <HStack spacing={1} color="gray">
      <Icon as={Users} boxSize={4} />
      <Text as="span">
        {new Intl.NumberFormat("en", { notation: "compact" }).format(
          role?.memberCount ?? 0
        )}
      </Text>
    </HStack>
  </HStack>
)

export default NftByRole
