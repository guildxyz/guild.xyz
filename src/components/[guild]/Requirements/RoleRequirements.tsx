import { Box, Collapse, Spinner, useColorModeValue, VStack } from "@chakra-ui/react"
import React, { memo, useEffect, useRef, useState } from "react"
import { VariableSizeList } from "react-window"
import { Role } from "types"
import LogicDivider from "../LogicDivider"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import RequirementDisplayComponent from "./components/RequirementDisplayComponent"

type Props = {
  role: Role
}

const VIRTUAL_LIST_REQUIREMENT_LIMIT = 10
const PARENT_PADDING = "var(--chakra-space-5)"

const RoleRequirements = ({ role }: Props) => {
  const isVirtualList = role.requirements.length > VIRTUAL_LIST_REQUIREMENT_LIMIT
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
  const listWrapperRef = useRef<HTMLDivElement>(null)

  const listRef = useRef(null)
  const rowHeights = useRef<Record<number, number>>({})

  useEffect(() => {
    if (!isRequirementsExpanded || !listWrapperRef.current) return
    listWrapperRef.current.children?.[0]?.scrollTo({
      behavior: "smooth",
      top: 30,
    })
  }, [isRequirementsExpanded])

  const Row = ({ index, style }: any) => {
    const rowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!rowRef.current) return
      // Recalculating row heights, then setting new row heights
      listRef.current.resetAfterIndex(0)
      rowHeights.current = {
        ...rowHeights.current,
        [index]: rowRef.current.clientHeight,
      }
    }, [rowRef])

    return (
      <Box style={style}>
        <Box ref={rowRef} paddingRight={PARENT_PADDING}>
          <RequirementDisplayComponent requirement={role.requirements[index]} />
          {index < role.requirements?.length - 1 && (
            <LogicDivider logic={role.logic} />
          )}
        </Box>
      </Box>
    )
  }

  return (
    <VStack spacing="0">
      {!role.requirements?.length ? (
        <Spinner />
      ) : isVirtualList ? (
        <Box ref={listWrapperRef} w="full" alignSelf="flex-start">
          <VariableSizeList
            ref={listRef}
            width={`calc(100% + ${PARENT_PADDING})`}
            height={isRequirementsExpanded ? 340 : 280}
            itemCount={role.requirements.length}
            itemSize={(i) => Math.max(rowHeights.current[i] ?? 0, 106)}
            className="custom-scrollbar"
            style={{
              marginBottom: isRequirementsExpanded && `calc(${PARENT_PADDING} * -1)`,
              overflowY: isRequirementsExpanded ? "scroll" : "hidden",
              WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%), linear-gradient(to left, black 0%, black 8px, transparent 8px, transparent 100%)`,
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

export default memo(RoleRequirements)
