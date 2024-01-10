import { Card, HStack, Heading, Spacer } from "@chakra-ui/react"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import { Role } from "types"

type Props = {
  role: Role
  isClaimed: boolean
  isLoading: boolean
  isDisabled: boolean
  onMint: (role: Role) => void
}

const MintableRole = ({ role, onMint, isClaimed, isLoading, isDisabled }: Props) => (
  <Card p={4} mb="3" borderRadius={"2xl"}>
    <HStack spacing={4}>
      <GuildLogo imageUrl={role.imageUrl} size={"36px"} />

      <HStack spacing={1}>
        <Heading
          as="h3"
          fontSize="md"
          fontFamily="display"
          wordBreak="break-all"
          noOfLines={1}
        >
          {role.name}
        </Heading>
      </HStack>

      <Spacer />

      <Button
        colorScheme={isClaimed ? "gray" : "purple"}
        size={"sm"}
        onClick={() => onMint(role)}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        {isClaimed ? "show QR" : "Mint proof"}
      </Button>
    </HStack>
  </Card>
)

export default MintableRole
