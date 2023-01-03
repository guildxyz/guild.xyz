import { Box, Collapse, Spinner, useColorModeValue, VStack } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { VariableSizeList } from "react-window"
import { Role } from "types"
import LogicDivider from "../LogicDivider"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import RequirementDisplayComponent from "./components/RequirementDisplayComponent"

type Props = {
  role: Role
}

const RoleRequirements = ({ role }: Props) => {
  const isVirtualList = role.requirements.length > 10
  const sliceIndex = (role.requirements?.length ?? 0) - 3
  const shownRequirements = (role.requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (role.requirements ?? []).slice(-sliceIndex) : []

  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)
  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  // Row related refs, state, and functions
  const listRef = useRef(null)
  const rowHeights = useRef<Record<number, number>>({})

  const setRowHeight = (rowIndex: number, rowHeight: number) => {
    // Recalculating row heights, then setting new row heights
    listRef.current.resetAfterIndex(0)
    rowHeights.current = { ...rowHeights.current, [rowIndex]: rowHeight }
  }

  const Row = ({ index, style }: any) => {
    const rowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!rowRef.current) return
      setRowHeight(index, rowRef.current.clientHeight)
    }, [rowRef])

    return (
      <Box style={style}>
        <Box ref={rowRef} paddingRight={isRequirementsExpanded ? 1 : 0}>
          <RequirementDisplayComponent requirement={hiddenRequirements[index]} />
          {index < hiddenRequirements.length - 1 && (
            <LogicDivider logic={role.logic} />
          )}
        </Box>
      </Box>
    )
  }

  if (!role.requirements?.length)
    return (
      <VStack>
        <Spinner />
      </VStack>
    )

  return (
    <VStack spacing="0">
      {isVirtualList ? (
        <Box
          w={isRequirementsExpanded ? "calc(100% + 0.25rem + 8px)" : "full"}
          mr={isRequirementsExpanded ? "calc(-0.25rem - 8px)" : 0}
        >
          <VariableSizeList
            ref={listRef}
            height={isRequirementsExpanded ? 312 : 276}
            itemCount={hiddenRequirements.length}
            itemSize={(i) => Math.max(rowHeights.current[i] ?? 0, 106)}
            className="custom-scrollbar"
            style={{
              paddingRight: "0.5rem",
              overflowY: isRequirementsExpanded ? "scroll" : "hidden",
            }}
          >
            {Row}
          </VariableSizeList>
        </Box>
      ) : (
        <>
          {shownRequirements.map((requirement, i) => (
            <React.Fragment key={i}>
              <RequirementDisplayComponent requirement={requirement} />
              {i < shownRequirements.length - 1 && (
                <LogicDivider logic={role.logic} />
              )}
            </React.Fragment>
          ))}

          <Collapse
            in={isRequirementsExpanded}
            animateOpacity={false}
            style={{ width: "100%" }}
          >
            {hiddenRequirements.map((requirement, i) => (
              <React.Fragment key={i}>
                {i === 0 && <LogicDivider logic={role.logic} />}
                <RequirementDisplayComponent requirement={requirement} />
                {i < hiddenRequirements.length - 1 && (
                  <LogicDivider logic={role.logic} />
                )}
              </React.Fragment>
            ))}
          </Collapse>
        </>
      )}

      {hiddenRequirements.length > 0 && (
        <>
          <ExpandRequirementsButton
            logic={role.logic}
            hiddenRequirements={hiddenRequirements.length}
            isRequirementsExpanded={isRequirementsExpanded}
            setIsRequirementsExpanded={setIsRequirementsExpanded}
            isHidden={isVirtualList && isRequirementsExpanded}
          />
          <Box
            position="absolute"
            bottom={{ base: 8, md: 0 }}
            left={0}
            right={0}
            height={6}
            bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
            pointerEvents="none"
            opacity={!isVirtualList && isRequirementsExpanded ? 0 : 0.6}
            transition="opacity 0.2s ease"
          />
        </>
      )}
    </VStack>
  )
}

export default RoleRequirements
