import {
  Box,
  forwardRef,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagProps,
  Text,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react"
import { Column } from "@tanstack/react-table"
import Button from "components/common/Button"
import { Funnel } from "phosphor-react"
import { Visibility } from "types"
import pluralize from "utils/pluralize"
import ClickableTagPopover from "../activity/ActivityLogAction/components/ClickableTagPopover"
import ViewRole from "../activity/ActivityLogAction/components/ClickableTagPopover/components/ViewRole"
import useGuild from "../hooks/useGuild"
import useRequirements from "../hooks/useRequirements"
import RoleTag from "../RoleTag"
import { CrmRole, Member } from "./useMembers"

type Props = {
  roles: CrmRole[]
  column: Column<Member, CrmRole>
}

const RoleTags = ({ roles, column }: Props) => {
  const renderedRoles = roles?.slice(0, 3)
  const moreRolesCount = roles?.length - 3
  const moreRoles = moreRolesCount > 0 && roles?.slice(-moreRolesCount)

  const moreRolesTagBorderColorVar = useColorModeValue("gray-300", "whiteAlpha-300")

  if (!renderedRoles?.length) return <Text>-</Text>

  return (
    <HStack>
      {renderedRoles.map(({ roleId, requirementId, amount }) => (
        <CrmTbodyRoleTag
          key={requirementId ?? roleId}
          {...{ roleId, amount, column }}
        />
      ))}
      {moreRolesCount > 0 && (
        <Popover trigger="hover" openDelay={0} closeDelay={0}>
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
                    roleId={roleId}
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
}

// TODO: move child components to separate files

type RoleTagProps = {
  roleId: number
  amount?: number
  column?: Column<Member, CrmRole>
} & TagProps

const CrmTbodyRoleTag = forwardRef<RoleTagProps, "span">(
  ({ roleId, amount, ...rest }, _ref) => {
    const { roles } = useGuild()
    const role = roles.find((r) => r.id === roleId)
    const tdBg = useColorModeValue(`gray.50`, "#3A3A40")
    const borderColor = useColorModeValue(`white`, "gray.500")

    if (!role) return null

    return (
      <Box
        pos="relative"
        _hover={{
          ".roleTagOverlay": {
            opacity: 1,
            maxWidth: "300px",
            transition: "max-width .2s, opacity 0s 0s",
            boxShadow: "lg",
            zIndex: 2,
          },
        }}
      >
        <CrmRoleTag
          roleId={roleId}
          amount={amount}
          minW="70px"
          maxW="max-content"
          {...rest}
        />

        <Box
          className="roleTagOverlay"
          pos="absolute"
          top="-1px"
          left="-1px"
          zIndex="1"
          opacity={0}
          maxWidth="calc(100% + 2px)" // +2px for the border
          width="max-content"
          borderWidth={"1px"}
          borderColor={borderColor}
          bg={tdBg}
          borderRadius={7}
          transition={"max-width .2s, opacity 0s .2s"}
          onClick={(e) => e.stopPropagation()}
        >
          <ClickableCrmRoleTag roleId={roleId} amount={amount} {...rest} />
        </Box>
      </Box>
    )
  }
)

const CrmRoleTag = forwardRef<RoleTagProps, "span">(
  ({ roleId, amount: amountProp, ...rest }, ref) => {
    const { roles } = useGuild()
    const role = roles.find((r) => r.id === roleId)

    const { data: requirements } = useRequirements(role?.id)

    if (!role) return null

    const amount = requirements?.length === 1 ? amountProp : undefined

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
  }
)

export const ClickableCrmRoleTag = ({
  roleId,
  column,
  onFilter,
  ...tagProps
}: RoleTagProps & { onFilter?: () => void }) => (
  <ClickableTagPopover
    options={
      <>
        <FilterByCrmRole {...{ roleId, column, onFilter }} />
        <ViewRole roleId={roleId} page="activity" />
        <ViewRole roleId={roleId} />
      </>
    }
    shouldRenderPortal={false}
  >
    <CrmRoleTag roleId={roleId} cursor="pointer" {...tagProps} />
  </ClickableTagPopover>
)

const FilterByCrmRole = ({ roleId, column, onFilter }) => {
  const onClick = () => {
    onFilter?.()
    column.setFilterValue((prevValue) => ({
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
}

export default RoleTags
