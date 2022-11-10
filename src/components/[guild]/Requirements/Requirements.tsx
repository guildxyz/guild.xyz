import { Box, Collapse, Spinner, useColorModeValue, VStack } from "@chakra-ui/react"
import React, { useState } from "react"
import { Logic, Requirement } from "types"
import LogicDivider from "../LogicDivider"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import REQUIREMENTS from "./requirementCards"

type Props = {
  requirements: Requirement[]
  logic: Logic
}

const Requirements = ({ requirements, logic }: Props) => {
  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (requirements ?? []).slice(-sliceIndex) : []

  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)
  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  return (
    <VStack spacing="0">
      {!requirements?.length ? (
        <Spinner />
      ) : (
        shownRequirements.map((requirement, i) => {
          const RequirementComponent =
            REQUIREMENTS[requirement.type].displayComponent

          if (RequirementComponent)
            return (
              <React.Fragment key={i}>
                <RequirementComponent requirement={requirement} />
                {i < shownRequirements.length - 1 && <LogicDivider logic={logic} />}
              </React.Fragment>
            )
        })
      )}

      <Collapse
        in={isRequirementsExpanded}
        animateOpacity={false}
        style={{ width: "100%" }}
      >
        {hiddenRequirements.map((requirement, i) => {
          const RequirementComponent =
            REQUIREMENTS[requirement.type].displayComponent

          if (RequirementComponent)
            return (
              <React.Fragment key={i}>
                {i === 0 && <LogicDivider logic={logic} />}
                <RequirementComponent requirement={requirement} />
                {i < hiddenRequirements.length - 1 && <LogicDivider logic={logic} />}
              </React.Fragment>
            )
        })}
      </Collapse>

      {hiddenRequirements.length > 0 && (
        <>
          <ExpandRequirementsButton
            logic={logic}
            hiddenRequirements={hiddenRequirements.length}
            isRequirementsExpanded={isRequirementsExpanded}
            setIsRequirementsExpanded={setIsRequirementsExpanded}
          />
          <Box
            position="absolute"
            bottom={{ base: 8, md: 0 }}
            left={0}
            right={0}
            height={6}
            bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
            pointerEvents="none"
            opacity={isRequirementsExpanded ? 0 : 0.6}
            transition="opacity 0.2s ease"
          />
        </>
      )}
    </VStack>
  )
}

export default Requirements
