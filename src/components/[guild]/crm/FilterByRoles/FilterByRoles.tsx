import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  HStack,
  Icon,
  Img,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import { Funnel } from "phosphor-react"
import { memo, useState } from "react"
import { Role, Visibility } from "types"
import useGuild from "../../hooks/useGuild"
import FilterByRolesLogicSelector from "./FilterByRolesLogicSelector"
import AddAndEditHiddenRoles from "./components/AddAndEditHiddenRoles"
import AddHiddenRoles from "./components/AddHiddenRoles"
import FilterByRolesSearch from "./components/FilterByRolesSearch"

const FilterByRoles = ({ getFilterValue, setFilterValue }: any) => {
  const { roles } = useGuild()
  const [searchValue, setSearchValue] = useState("")

  const publicRoles = roles?.filter((role) => role.visibility !== Visibility.HIDDEN)
  const hiddenRoles = roles?.filter((role) => role.visibility === Visibility.HIDDEN)

  const selectedRoleIds: number[] = getFilterValue()?.roleIds ?? []
  const setSelectedRoleIds = (newValue: number[]) => {
    setFilterValue((prevValue) => ({
      ...prevValue,
      roleIds: newValue,
    }))
  }

  const headerBg = useColorModeValue(null, "whiteAlpha.50")
  const bodyBg = useColorModeValue("gray.50", null)

  if (!roles) return null

  return (
    <Popover placement="bottom-end" closeOnBlur={false} isLazy>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="ghost"
              px="2"
              right="-2"
              colorScheme={selectedRoleIds.length ? "blue" : "gray"}
            >
              {!!selectedRoleIds.length && (
                <Text colorScheme="blue" pl="0.5" pr="1" mb="-1px" fontSize="xs">
                  {`${selectedRoleIds.length} filtered roles`}
                </Text>
              )}
              <Icon as={Funnel} />
            </Button>
          </PopoverTrigger>
          <Portal>
            {isOpen && (
              <Box
                pos={"fixed"}
                top="0"
                left="0"
                h="100vh"
                w="100vw"
                zIndex={"1200"}
                onClick={onClose}
              />
            )}
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader
                p="2.5"
                pb="2 !important"
                bg={headerBg}
                borderTopRadius={"xl"}
              >
                <FilterByRolesLogicSelector
                  {...{ getFilterValue, setFilterValue }}
                />
                <FilterByRolesSearch {...{ searchValue, setSearchValue }} />
              </PopoverHeader>
              <PopoverBody
                py="4"
                bg={bodyBg}
                borderBottomRadius={"xl"}
                overflowY={"auto"}
                maxH="md"
              >
                <Stack spacing={5}>
                  {hiddenRoles?.length ? (
                    <RoleCheckboxGroup
                      label="Hidden roles"
                      labelRightElement={<AddAndEditHiddenRoles />}
                      selectedRoleIds={selectedRoleIds}
                      setSelectedRoleIds={setSelectedRoleIds}
                      roles={hiddenRoles}
                      searchValue={searchValue}
                    />
                  ) : (
                    <AddHiddenRoles />
                  )}
                  <RoleCheckboxGroup
                    label="Public roles"
                    selectedRoleIds={selectedRoleIds}
                    setSelectedRoleIds={setSelectedRoleIds}
                    roles={publicRoles}
                    searchValue={searchValue}
                  />
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}

type RoleCheckboxGroupProps = {
  label: string
  labelRightElement?: JSX.Element
  roles: Role[]
  selectedRoleIds: number[]
  setSelectedRoleIds: (newValue: number[]) => void
  searchValue?: string
}

const RoleCheckboxGroup = memo(
  ({
    label,
    labelRightElement = null,
    roles,
    selectedRoleIds,
    setSelectedRoleIds,
    searchValue,
  }: RoleCheckboxGroupProps) => {
    const roleIds = roles.map((role) => role.id)
    const shownRoles = roles.filter((role) =>
      role.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    const allChecked = roleIds.every((id) => selectedRoleIds.includes(id))
    const isIndeterminate =
      roleIds.some((a) => selectedRoleIds.includes(a)) && !allChecked

    return (
      <Box>
        <HStack justifyContent={"space-between"}>
          <Checkbox
            isChecked={allChecked}
            isIndeterminate={isIndeterminate}
            onChange={(e) => setSelectedRoleIds(e.target.checked ? roleIds : [])}
            isDisabled={!!searchValue}
          >
            <Text fontSize="sm" fontWeight={"semibold"}>
              {label}
            </Text>
          </Checkbox>
          {labelRightElement}
        </HStack>
        <Stack pl={6} mt={3} divider={<Divider />}>
          {shownRoles?.length ? (
            shownRoles?.map((role) => (
              <RoleCheckbox
                key={role.id}
                role={role}
                isChecked={selectedRoleIds.includes(role.id)}
                onChange={(e) =>
                  setSelectedRoleIds(
                    e.target.checked
                      ? [...selectedRoleIds, role.id]
                      : selectedRoleIds.filter((item) => item !== role.id)
                  )
                }
              />
            ))
          ) : (
            <Text>{`No results for "${searchValue}"`}</Text>
          )}
        </Stack>
      </Box>
    )
  }
)

type RoleCheckboxProps = {
  role: Role
  isChecked: boolean
  onChange: any
}

const RoleCheckbox = memo(({ role, isChecked, onChange }: RoleCheckboxProps) => {
  const { colorMode } = useColorMode()

  return (
    <Checkbox
      isChecked={isChecked}
      onChange={onChange}
      spacing={3}
      w="full"
      sx={{ ".chakra-checkbox__label": { w: "full" } }}
    >
      <HStack spacing={1.5} w="full">
        {role.imageUrl?.startsWith("/guildLogos") ? (
          <Center boxSize="5">
            <Img
              src={role.imageUrl}
              filter={colorMode === "light" && "brightness(0)"}
            />
          </Center>
        ) : (
          <Img src={role.imageUrl} boxSize="5" borderRadius={"full"} />
        )}
        <Text w="full" noOfLines={1}>
          {role.name}
        </Text>
        <MemberCount roleId={role.id} memberCount={role.memberCount} size="sm" />
      </HStack>
    </Checkbox>
  )
})

export default FilterByRoles
