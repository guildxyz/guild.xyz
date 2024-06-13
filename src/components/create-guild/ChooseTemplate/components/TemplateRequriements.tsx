import { Box, Collapse, VStack, useColorModeValue } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import AnyOfHeader from "components/[guild]/Requirements/components/AnyOfHeader"
import ExpandRequirementsButton from "components/[guild]/Requirements/components/ExpandRequirementsButton"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { RoleCardCollapseProps } from "components/[guild]/RoleCard"
import React, { memo } from "react"
import { Requirement, RoleFormType } from "types"

type Props = {
  role: RoleFormType
  isExpanded: boolean
  onToggleExpanded: () => void
} & RoleCardCollapseProps

const TemplateRequirements = ({ role, isExpanded, onToggleExpanded }: Props) => {
  const requirements = role.requirements

  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (requirements ?? []).slice(-sliceIndex) : []

  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  return (
    <VStack spacing="0">
      {role.logic === "ANY_OF" && <AnyOfHeader anyOfNum={role.anyOfNum} />}
      <VStack spacing={0} w="full" p={5} pt={0}>
        <VStack spacing={0} w="full">
          {shownRequirements.map((requirement, i) => (
            <>
              <RequirementDisplayComponent
                requirement={requirement as Requirement}
              />
              {i < shownRequirements.length - 1 && (
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                <LogicDivider logic={role.logic} />
              )}
            </>
          ))}
        </VStack>
        <Collapse in={isExpanded} animateOpacity={false} style={{ width: "100%" }}>
          {hiddenRequirements.map((requirement, i) => (
            <React.Fragment key={i}>
              {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
              {i === 0 && <LogicDivider logic={role.logic} />}
              <RequirementDisplayComponent
                requirement={requirement as Requirement}
                {...(["EMAIL_VERIFIED", "TWITTER_FOLLOWER_COUNT"].includes(
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  requirement.type
                )
                  ? { footer: null }
                  : undefined)}
              />
              {i < hiddenRequirements.length - 1 && (
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                <LogicDivider logic={role.logic} />
              )}
            </React.Fragment>
          ))}
        </Collapse>
        {hiddenRequirements.length > 0 && (
          <>
            <ExpandRequirementsButton
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              logic={role.logic}
              hiddenRequirements={hiddenRequirements.length}
              isRequirementsExpanded={isExpanded}
              onToggleExpanded={(e: any) => {
                e.stopPropagation()
                onToggleExpanded()
              }}
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height={6}
              bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
              pointerEvents="none"
              opacity={isExpanded ? 0 : 0.6}
              transition="opacity 0.2s ease"
            />
          </>
        )}
      </VStack>
    </VStack>
  )
}

export default memo(TemplateRequirements)
