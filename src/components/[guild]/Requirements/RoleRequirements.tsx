import {
  Box,
  Collapse,
  Icon,
  SlideFade,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Question } from "@phosphor-icons/react"
import React, {
  Fragment,
  memo,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { VariableSizeList } from "react-window"
import { Role } from "types"
import LogicDivider from "../LogicDivider"
import { RoleCardCollapseProps } from "../RoleCard"
import useRequirements from "../hooks/useRequirements"
import AnyOfHeader from "./components/AnyOfHeader"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import HiddenRequirementAccessIndicator from "./components/HiddenRequirementAccessIndicator"
import RequirementComponent, { RequirementSkeleton } from "./components/Requirement"
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
  const { data: requirements, isLoading } = useRequirements(role?.id)

  const isVirtualList = (requirements?.length ?? 0) > VIRTUAL_LIST_REQUIREMENT_LIMIT
  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const notShownRequirements =
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
    <SlideFade
      in={isOpen}
      {...(!isOpen && ({ inert: "true" } as any))}
      style={{ width: "100%" }}
    >
      <VStack spacing="0">
        {role.logic === "ANY_OF" && <AnyOfHeader anyOfNum={role.anyOfNum} />}
        <VStack ref={initialRequirementsRef} spacing={0} w="full" p={5} pt={0}>
          {/* Checking !data here too, so we don't show a loading state when we have data from the public request, but the authenticated request is still loading */}
          {isLoading && !requirements ? (
            <RoleRequirementsSkeleton />
          ) : isVirtualList ? (
            <VirtualRequirements {...{ isExpanded, descriptionRef }} role={role} />
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
                {(role.hiddenRequirements || requirements?.length === 0) &&
                  !notShownRequirements.length && (
                    <>
                      {shownRequirements.length > 0 && (
                        <LogicDivider logic={role.logic} />
                      )}
                      <SomeSecretRequirements roleId={role.id} />
                    </>
                  )}
              </VStack>
              <Collapse
                in={isExpanded}
                animateOpacity={false}
                style={{ width: "100%" }}
              >
                {notShownRequirements.map((requirement, i) => (
                  <React.Fragment key={i}>
                    {i === 0 && <LogicDivider logic={role.logic} />}
                    <RequirementDisplayComponent requirement={requirement} />
                    {i < notShownRequirements.length - 1 && (
                      <LogicDivider logic={role.logic} />
                    )}
                  </React.Fragment>
                ))}

                {role.hiddenRequirements && (
                  <>
                    <LogicDivider logic={role.logic} />
                    <SomeSecretRequirements roleId={role.id} />
                  </>
                )}
              </Collapse>
            </>
          )}

          {notShownRequirements.length > 0 && onToggleExpanded && (
            <>
              <ExpandRequirementsButton
                logic={role.logic}
                notShownRequirements={notShownRequirements.length}
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
      </VStack>
    </SlideFade>
  )
}

const VirtualRequirements = memo(
  ({
    isExpanded,
    role,
    descriptionRef,
  }: {
    isExpanded: boolean
    role: Role
    descriptionRef?: MutableRefObject<HTMLDivElement>
  }) => {
    const { data: requirements } = useRequirements(role.id)

    const listRef = useRef(null)
    const rowHeights = useRef<Record<number, number>>({})
    const expandedHeight = useMemo(() => {
      const descriptionHeight =
        descriptionRef?.current?.getBoundingClientRect().height ?? 0
      return Math.max(descriptionHeight + 50, 500)
    }, [descriptionRef])

    const Row = memo(({ index, style }: any) => {
      const rowRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
        if (!rowRef.current) return

        const observer = new ResizeObserver(() => {
          // Recalculating row heights, then setting new row heights
          listRef.current.resetAfterIndex(0)
          rowHeights.current = {
            ...rowHeights.current,
            [index]: rowRef.current?.clientHeight,
          }
        })

        observer.observe(rowRef.current)

        return () => {
          observer.disconnect()
        }
      }, [rowRef, index])

      if (!requirements?.length) return <RoleRequirementsSkeleton />

      return (
        <Box style={style}>
          <Box ref={rowRef} paddingRight={PARENT_PADDING}>
            <RequirementDisplayComponent requirement={requirements[index]} />
            {index < requirements.length - 1 && <LogicDivider logic={role.logic} />}
            {index === requirements.length - 1 && role.hiddenRequirements && (
              <>
                <LogicDivider logic={role.logic} />
                <SomeSecretRequirements roleId={role.id} />
              </>
            )}
          </Box>
        </Box>
      )
    })

    return (
      <Box w="full" alignSelf="flex-start">
        <VariableSizeList
          ref={listRef}
          width={`calc(100% + ${PARENT_PADDING})`}
          height={isExpanded ? expandedHeight : 275}
          itemCount={role.requirements.length}
          itemSize={(i) => Math.max(rowHeights.current[i] ?? 0, 106)}
          className="custom-scrollbar"
          style={{
            marginBottom: isExpanded && `calc(${PARENT_PADDING} * -1)`,
            overflowY: isExpanded ? "scroll" : "hidden",
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%), linear-gradient(to left, black 0%, black 8px, transparent 8px, transparent 100%)`,
            transition: "height 0.2s ease",
          }}
        >
          {Row}
        </VariableSizeList>
      </Box>
    )
  }
)

const SomeSecretRequirements = ({ roleId }: { roleId: number }) => (
  <RequirementComponent
    image={<Icon as={Question} boxSize={5} />}
    rightElement={<HiddenRequirementAccessIndicator roleId={roleId} />}
  >
    Some secret requirements
  </RequirementComponent>
)

const RoleRequirementsSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <Fragment key={i}>
        <RequirementSkeleton key={i} />
        {i !== 2 && <LogicDivider logic="ANY_OF" />}
      </Fragment>
    ))}
  </>
)

export default memo(RoleRequirements)
export { RoleRequirementsSkeleton }
