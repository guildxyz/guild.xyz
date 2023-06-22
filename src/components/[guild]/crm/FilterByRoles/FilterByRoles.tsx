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
import { Column } from "@tanstack/react-table"
import { Funnel } from "phosphor-react"
import { useState } from "react"
import { Visibility } from "types"
import useGuild from "../../hooks/useGuild"
import FilterByRolesLogicSelector from "./FilterByRolesLogicSelector"
import AddHiddenRoles from "./components/AddHiddenRoles"
import FilterByRolesSearch from "./components/FilterByRolesSearch"

type Props = {
  column: Column<any>
}

const FilterByRoles = ({ column }: Props) => {
  const { roles } = useGuild()
  const [searchValue, setSearchValue] = useState("")

  const publicRoles = roles.filter((role) => role.visibility !== Visibility.HIDDEN)
  const hiddenRoles = roles.filter((role) => role.visibility === Visibility.HIDDEN)

  const selectedRoleIds = column.getLeafColumns().reduce(
    (acc, curr) => {
      acc[curr.id] = (curr.getFilterValue() as any)?.roleIds ?? []
      return acc
    },
    { publicRoleIds: [], hiddenRoleIds: [] }
  )
  const selectedAggregated =
    selectedRoleIds.publicRoleIds?.length + selectedRoleIds.hiddenRoleIds?.length

  const headerBg = useColorModeValue(null, "whiteAlpha.50")
  const bodyBg = useColorModeValue("gray.50", null)

  if (!roles) return null

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          size="sm"
          variant="ghost"
          px="2"
          right="-2"
          colorScheme={selectedAggregated ? "blue" : "gray"}
        >
          {!!selectedAggregated && (
            <Text colorScheme="blue" pl="0.5" pr="1" mb="-1px" fontSize="xs">
              {`${selectedAggregated} filtered roles`}
            </Text>
          )}
          <Icon as={Funnel} />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader
            p="2.5"
            pb="2 !important"
            bg={headerBg}
            borderTopRadius={"xl"}
          >
            <FilterByRolesLogicSelector column={column} />
            <FilterByRolesSearch {...{ searchValue, setSearchValue }} />
          </PopoverHeader>
          <PopoverBody py="4" bg={bodyBg} borderBottomRadius={"xl"}>
            <Stack spacing={5}>
              {hiddenRoles?.length ? (
                <RoleCheckboxGroup
                  label="Private roles"
                  selectedRoleIds={selectedRoleIds.hiddenRoleIds}
                  setSelectedRoleIds={(newValue) => {
                    column
                      .getLeafColumns()
                      .find(({ id }) => id === "hiddenRoleIds")
                      .setFilterValue((prevValue) => ({
                        ...prevValue,
                        roleIds: newValue,
                      }))
                  }}
                  roles={hiddenRoles}
                  searchValue={searchValue}
                />
              ) : (
                <AddHiddenRoles />
              )}
              <RoleCheckboxGroup
                label="Public roles"
                selectedRoleIds={selectedRoleIds.publicRoleIds}
                setSelectedRoleIds={(newValue) => {
                  column
                    .getLeafColumns()
                    .find(({ id }) => id === "publicRoleIds")
                    .setFilterValue((prevValue) => ({
                      ...prevValue,
                      roleIds: newValue,
                    }))
                }}
                roles={publicRoles}
                searchValue={searchValue}
              />
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

const RoleCheckboxGroup = ({
  label,
  roles,
  selectedRoleIds,
  setSelectedRoleIds,
  searchValue,
}) => {
  const roleIds = roles.map((role) => role.id)
  const shownRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const allChecked = roleIds.every((id) => selectedRoleIds.includes(id))
  const isIndeterminate =
    roleIds.some((a) => selectedRoleIds.includes(a)) && !allChecked

  const { colorMode } = useColorMode()

  return (
    <Box>
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
      <Stack pl={6} mt={3} divider={<Divider />}>
        {shownRoles?.length ? (
          shownRoles?.map((role) => (
            <Checkbox
              key={role.id}
              isChecked={selectedRoleIds.includes(role.id)}
              onChange={(e) =>
                setSelectedRoleIds(
                  e.target.checked
                    ? [...selectedRoleIds, role.id]
                    : selectedRoleIds.filter((item) => item !== role.id)
                )
              }
              spacing={3}
            >
              <HStack spacing={1.5}>
                {role.imageUrl.startsWith("/guildLogos") ? (
                  <Center boxSize="5">
                    <Img
                      src={role.imageUrl}
                      filter={colorMode === "light" && "brightness(0)"}
                    />
                  </Center>
                ) : (
                  <Img src={role.imageUrl} boxSize="5" borderRadius={"full"} />
                )}
                <Text>{role.name}</Text>
              </HStack>
            </Checkbox>
          ))
        ) : (
          <Text>{`No results for "${searchValue}"`}</Text>
        )}
      </Stack>
    </Box>
  )
}

export default FilterByRoles
