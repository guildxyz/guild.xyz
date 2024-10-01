import { Stack, useColorModeValue } from "@chakra-ui/react"
import { RoleRequirements } from "components/[guild]/Requirements/RoleRequirements"
import useGuild from "components/[guild]/hooks/useGuild"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { PropsWithChildren } from "react"
import { Role } from "types"

type Props = {
  role: Role
}

const RequirementsCard = ({ role, children }: PropsWithChildren<Props>) => {
  const { isValidating } = useGuild()
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <CardMotionWrapper>
      <Card w="full" h="max-content">
        <Stack
          position="relative"
          bgColor={requirementsSectionBgColor}
          w="full"
          alignItems="center"
          borderBottomWidth={!!children ? 1 : 0}
          borderColor={requirementsSectionBorderColor}
        >
          <RoleRequirements
            role={role}
            isOpen
            withScroll
            isRoleLoading={isValidating}
            className="pt-5 md:basis-auto"
          />
        </Stack>

        {children}
      </Card>
    </CardMotionWrapper>
  )
}
export default RequirementsCard
