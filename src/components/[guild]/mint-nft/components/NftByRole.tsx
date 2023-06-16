import { HStack, Icon, Text } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { motion } from "framer-motion"
import { Users } from "phosphor-react"
import { Role } from "types"

type Props = {
  role: Role
}

const MotionHStack = motion(HStack)

const NftByRole = ({ role }: Props) => (
  <MotionHStack layout="position" layoutId="nft-by-role" pb={2}>
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
  </MotionHStack>
)

export default NftByRole
