import { HStack, Icon, Text } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import Link from "components/common/Link"
import useGuild from "components/[guild]/hooks/useGuild"
import { Users } from "phosphor-react"
import { Role } from "types"

type Props = {
  role: Role
}

const NftByRole = ({ role }: Props) => {
  const { urlName } = useGuild()

  return (
    <HStack pb={2}>
      <Text as="span">by Role:</Text>
      <HStack>
        <GuildLogo imageUrl={role.imageUrl} size={6} />

        <Link href={`/${urlName}#role-${role.id}`} fontWeight="bold">
          {role.name}
        </Link>
      </HStack>

      <HStack spacing={1} color="gray">
        <Icon as={Users} boxSize={4} />
        <Text as="span">
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            role.memberCount
          )}
        </Text>
      </HStack>
    </HStack>
  )
}

export default NftByRole
