import { HStack, Heading, Wrap } from "@chakra-ui/react"
import Visibility from "components/[guild]/Visibility"
import GuildLogo from "components/common/GuildLogo"
import { PropsWithChildren } from "react"

const RoleHeader = ({ role, isOpen = true, children }: PropsWithChildren<any>) => (
  <HStack spacing={3} p={5}>
    <HStack spacing={4} minW={0}>
      <GuildLogo imageUrl={role.imageUrl} size={{ base: "48px", md: "52px" }} />
      <Wrap spacingX={3} spacingY={1}>
        <Heading
          as="h3"
          fontSize="xl"
          fontFamily="display"
          minW={0}
          overflowWrap={"break-word"}
          noOfLines={!isOpen && 1}
          mt="-1px !important"
        >
          {role.name}
        </Heading>
        <Visibility
          visibilityRoleId={role.visibilityRoleId}
          entityVisibility={role.visibility}
          showTagLabel
        />
      </Wrap>
    </HStack>
    {children}
  </HStack>
)

export default RoleHeader
