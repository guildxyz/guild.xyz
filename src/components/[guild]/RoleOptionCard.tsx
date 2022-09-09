import { Checkbox, CheckboxProps, Heading, HStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import { forwardRef } from "react"
import { Role } from "types"

type Props = {
  role: Role
  size?: "md" | "lg"
} & Omit<CheckboxProps, "role">

const RoleOptionCard = forwardRef(
  ({ role, size = "md", ...rest }: Props, ref: any) => (
    <Card>
      <Checkbox
        value={role.id.toString()}
        size={size}
        p={size === "lg" ? 6 : 3}
        spacing="0"
        flexDirection={"row-reverse"}
        justifyContent="space-between"
        ref={ref}
        {...rest}
      >
        <HStack spacing={4}>
          <GuildLogo
            imageUrl={role.imageUrl}
            size={size === "lg" ? "48px" : "36px"}
          />
          <Heading
            as="h3"
            fontSize={size === "lg" ? "xl" : "md"}
            fontFamily="display"
          >
            {role.name}
          </Heading>
          <MemberCount memberCount={role.memberCount} />
        </HStack>
      </Checkbox>
    </Card>
  )
)

export default RoleOptionCard
