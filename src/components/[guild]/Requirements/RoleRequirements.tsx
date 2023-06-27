import {
  Box,
  Collapse,
  SlideFade,
  Spinner,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import React, { memo, MutableRefObject, useEffect, useMemo, useRef } from "react"
import { VariableSizeList } from "react-window"
import { Logic, Requirement, Role } from "types"
import useGuild from "../hooks/useGuild"
import LogicDivider from "../LogicDivider"
import { RoleCardCollapseProps } from "../RoleCard"
import AnyOfHeader from "./components/AnyOfHeader"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import RequirementDisplayComponent from "./components/RequirementDisplayComponent"

type Props = {
  role: Role
  isOpen: boolean
} & RoleCardCollapseProps

const VIRTUAL_LIST_REQUIREMENT_LIMIT = 10
const PARENT_PADDING = "var(--chakra-space-5)"

const RoleRequirements = ({
  role,
  isOpen,
  isExpanded,
  onToggleExpanded,
  descriptionRef,
  initialRequirementsRef,
}: Props) => {
  const guild = useGuild()

  const requirements =
    role.hiddenRequirements ||
    ((role.requirements ?? []).length === 0 && !(guild as any).isFallback)
      ? [...role.requirements, { type: "HIDDEN", roleId: role.id } as Requirement]
      : role.requirements

  const isVirtualList = requirements?.length > VIRTUAL_LIST_REQUIREMENT_LIMIT
  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (requirements ?? []).slice(-sliceIndex) : []

  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  return (
    /**
     * Spreading inert because it's not added to @types/react yet:
     * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
     */
    <SlideFade in={isOpen} {...(!isOpen && { inert: "true" })}>
      <VStack spacing="0">
        {role.logic === "ANY_OF" && <AnyOfHeader anyOfNum={role.anyOfNum} />}
        {!requirements?.length ? (
          <Spinner />
        ) : isVirtualList ? (
          <VirtualRequirements
            {...{ isExpanded, requirements, descriptionRef }}
            logic={role.logic}
          />
        ) : (
          <>
            <VStack ref={initialRequirementsRef} spacing={0} w="full">
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
            </VStack>
            <Collapse
              in={isExpanded}
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
              isRequirementsExpanded={isExpanded}
              onToggleExpanded={onToggleExpanded}
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height={6}
              bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
              pointerEvents="none"
              opacity={!isVirtualList && isExpanded ? 0 : 0.6}
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
    isExpanded,
    requirements,
    logic,
    descriptionRef,
  }: {
    isExpanded: boolean
    requirements: Requirement[]
    logic: Logic
    descriptionRef: MutableRefObject<HTMLDivElement>
  }) => {
    const listWrapperRef = useRef<HTMLDivElement>(null)

    const listRef = useRef(null)
    const rowHeights = useRef<Record<number, number>>({})
    const expandedHeight = useMemo(() => {
      const descriptionHeight =
        descriptionRef.current?.getBoundingClientRect().height ?? 0
      return Math.max(descriptionHeight + 50, 500)
    }, [descriptionRef.current])

    const Row = memo(({ index, style }: any) => {
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
    })

    return (
      <Box ref={listWrapperRef} w="full" alignSelf="flex-start">
        <VariableSizeList
          ref={listRef}
          width={`calc(100% + ${PARENT_PADDING})`}
          height={isExpanded ? expandedHeight : 275}
          itemCount={requirements.length}
          itemSize={(i) => Math.max(rowHeights.current[i] ?? 0, 106)}
          className="custom-scrollbar"
          style={{
            marginBottom: isExpanded && `calc(${PARENT_PADDING} * -1)`,
            overflowY: isExpanded ? "scroll" : "hidden",
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
