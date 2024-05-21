import {
  Box,
  forwardRef,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Tag,
  TagLabel,
  TagProps,
  Text,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Funnel } from "phosphor-react"
import { memo } from "react"
import { Role, Visibility } from "types"
import pluralize from "utils/pluralize"
import ClickableTagPopover from "../activity/ActivityLogAction/components/ClickableTagPopover"
import ViewRole from "../activity/ActivityLogAction/components/ClickableTagPopover/components/ViewRole"
import useGuild from "../hooks/useGuild"
import RoleTag from "../RoleTag"
import { CrmRole } from "./useMembers"

type Props = {
  roles: CrmRole[]
  setFilterValue: () => void
}

const RoleTags = memo(({ roles, setFilterValue }: Props) => {
  const { roles: rolesData, isDetailed } = useGuild()
  const renderedRoles = roles?.slice(0, 3)
  const moreRolesCount = roles?.length - 3
  const moreRoles = moreRolesCount > 0 && roles?.slice(-moreRolesCount)

  const moreRolesTagBorderColorVar = useColorModeValue("gray-300", "whiteAlpha-300")

  if (!renderedRoles?.length) return <Text>-</Text>
  if (!rolesData || !isDetailed) return <Skeleton w="70%" h="5" />

  return (
    <HStack>
      {renderedRoles.map(({ roleId, requirementId, amount }) => (
        <CrmTbodyRoleTag
          key={requirementId ?? roleId}
          role={rolesData.find((r) => r.id === roleId) as any}
          {...{ amount, setFilterValue }}
        />
      ))}
      {moreRolesCount > 0 && (
        <Popover
          trigger="hover"
          openDelay={0}
          closeDelay={0}
          eventListeners={{ scroll: false }}
          computePositionOnMount={false}
          isLazy
        >
          <PopoverTrigger>
            <Tag
              variant={"outline"}
              color="var(--chakra-colors-chakra-body-text)"
              w="max-content"
              sx={{
                "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
              }}
            >
              <TagLabel>{pluralize(moreRolesCount, "more role")}</TagLabel>
            </Tag>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Wrap>
                {moreRoles?.slice(0, 15).map(({ roleId, requirementId, amount }) => (
                  <CrmRoleTag
                    key={requirementId ?? roleId}
                    role={rolesData.find((r) => r.id === roleId) as any}
                    amount={amount}
                  />
                ))}
              </Wrap>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </HStack>
  )
})

type RoleTagProps = {
  role: Role
  amount?: number
  setFilterValue?: (updater: any) => void
} & TagProps

const CrmTbodyRoleTag = memo(
  forwardRef<RoleTagProps, "span">(({ role, amount, ...rest }, _ref) => {
    const tdBg = useColorModeValue(`gray.50`, "#3A3A40")
    const borderColor = useColorModeValue(`white`, "gray.500")

    return (
      <Box
        pos="relative"
        _hover={{
          ".roleTagOverlay": {
            opacity: 1,
            maxWidth: "300px",
            transition: "max-width .2s, opacity 0s 0s",
            boxShadow: "lg",
            borderColor,
            zIndex: 2,
          },
        }}
      >
        {/**
         * Dummy element to calculate the min space in the DOM (the actual tag is absolute so
         * it can expand). Used an actual CrmRoleTag for it before but was too expensive
         * performance-wise
         */}
        <Box
          h="6"
          pl="7"
          pr="2"
          border="1px solid transparent"
          fontWeight={"medium"}
          minW="65px"
          opacity={0}
          maxW="max-content"
          overflow="hidden"
          noOfLines={1}
        >
          {`${role.name} ${
            typeof amount === "number" ? `- ${Number(amount.toFixed(2))}` : ""
          }`}
        </Box>

        <Box
          className="roleTagOverlay"
          pos="absolute"
          top="-1px"
          left="-1px"
          zIndex="1"
          minW="65px"
          maxWidth="calc(100% + 2px)" // +2px for the border
          width="max-content"
          borderWidth={"1px"}
          borderColor="transparent"
          bg={tdBg}
          borderRadius={7}
          transition={"max-width .2s, opacity 0s .2s"}
          onClick={(e) => e.stopPropagation()}
        >
          <ClickableCrmRoleTag
            role={role}
            amount={amount}
            shouldRenderPortal
            {...rest}
          />
        </Box>
      </Box>
    )
  })
)

export const CrmRoleTag = memo(
  forwardRef<RoleTagProps, "span">(({ role, amount: amountProp, ...rest }, ref) => {
    if (!role) return null

    const amount = role.requirements?.length === 1 ? amountProp : undefined

    return (
      <RoleTag
        ref={ref}
        name={role.name}
        imageUrl={role.imageUrl}
        isHidden={role.visibility === Visibility.HIDDEN}
        amount={typeof amount === "number" ? Number(amount.toFixed(2)) : undefined}
        {...rest}
      />
    )
  })
)

export const ClickableCrmRoleTag = memo(
  ({
    role,
    setFilterValue,
    onFilter,
    shouldRenderPortal = false,
    ...tagProps
  }: RoleTagProps & { onFilter?: () => void; shouldRenderPortal?: boolean }) => (
    <ClickableTagPopover
      options={
        <>
          <FilterByCrmRole roleId={role.id} {...{ setFilterValue, onFilter }} />
          <ViewRole roleId={role.id} page="activity" />
          <ViewRole roleId={role.id} />
        </>
      }
      shouldRenderPortal={shouldRenderPortal}
    >
      <CrmRoleTag role={role} cursor="pointer" {...tagProps} />
    </ClickableTagPopover>
  )
)

const FilterByCrmRole = memo(({ roleId, setFilterValue, onFilter }: any) => {
  const onClick = () => {
    onFilter?.()
    setFilterValue((prevValue) => ({
      ...prevValue,
      roleIds: [roleId],
    }))
  }

  return (
    <Button
      variant="ghost"
      leftIcon={<Funnel />}
      size="sm"
      borderRadius={0}
      onClick={onClick}
      justifyContent="start"
    >
      Filter by role
    </Button>
  )
})

export default RoleTags
