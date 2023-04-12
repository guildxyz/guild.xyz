import {
  Box,
  Collapse,
  SlideFade,
  Spinner,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import React, { memo, useEffect, useRef, useState } from "react"
import { VariableSizeList } from "react-window"
import { Logic, Requirement, Role } from "types"
import LogicDivider from "../LogicDivider"
import AnyOfHeader from "./components/AnyOfHeader"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import RequirementDisplayComponent from "./components/RequirementDisplayComponent"

type Props = {
  role: Role
  isOpen: boolean
}

const VIRTUAL_LIST_REQUIREMENT_LIMIT = 10
const PARENT_PADDING = "var(--chakra-space-5)"

const RoleRequirements = ({ role, isOpen }: Props) => {
  const requirements = role.hiddenRequirements
    ? [...role.requirements, { isHidden: true, type: "FREE" } as Requirement]
    : role.requirements

  const isVirtualList = requirements?.length > VIRTUAL_LIST_REQUIREMENT_LIMIT
  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (requirements ?? []).slice(-sliceIndex) : []

  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)
  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  useEffect(() => {
    if (!isOpen) setIsRequirementsExpanded(false)
  }, [isOpen])

  return (
    /**
     * Spreading inert because it's not added to @types/react yet:
     * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
     */
    <SlideFade in={isOpen} {...(!isOpen && { inert: "true" })}>
      <VStack spacing="0">
        {role.logic === "ANY_OF" && <AnyOfHeader />}
        {!requirements?.length ? (
          <Spinner />
        ) : isVirtualList ? (
          <VirtualRequirements
            {...{ isRequirementsExpanded, requirements }}
            logic={role.logic}
          />
        ) : (
          <>
            {shownRequirements.map((requirement, i) => (
              <SlideFade
                key={i}
                in={isOpen}
                transition={{ enter: { delay: i * 0.1 } }}
                style={{ width: "100%" }}
              >
                <RequirementDisplayComponent requirement={requirement} />
                {i < shownRequirements.length - 1 && (
                  <LogicDivider logic={role.logic} />
                )}
              </SlideFade>
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
              bottom={0}
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
    </SlideFade>
  )
}

const VirtualRequirements = memo(
  ({
    isRequirementsExpanded,
    requirements,
    logic,
  }: {
    isRequirementsExpanded: boolean
    requirements: Requirement[]
    logic: Logic
  }) => {
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
            <RequirementDisplayComponent requirement={requirements[index]} />
            {index < requirements?.length - 1 && <LogicDivider logic={logic} />}
          </Box>
        </Box>
      )
    }

    return (
      <Box ref={listWrapperRef} w="full" alignSelf="flex-start">
        <VariableSizeList
          ref={listRef}
          width={`calc(100% + ${PARENT_PADDING})`}
          height={isRequirementsExpanded ? 340 : 280}
          itemCount={requirements.length}
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
    )
  }
)

export default memo(RoleRequirements)
