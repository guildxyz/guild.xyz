import {
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
import useGuild from "../../hooks/useGuild"
import FilterByRolesLogicSelector from "./FilterByRolesLogicSelector"
import FilterByRolesSearch from "./components/FilterByRolesSearch"

type Props = {
  column: Column<any>
}

const FilterByRoles = ({ column }: Props) => {
  const { roles } = useGuild()
  const [searchValue, setSearchValue] = useState("")

  const selectedRoleIds = (column.getFilterValue() as any)?.roleIds ?? []

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
            <RoleCheckboxGroup
              label="Public roles"
              selectedRoleIds={selectedRoleIds}
              setSelectedRoleIds={(newValue) =>
                column.setFilterValue((prevValue) => ({
                  ...prevValue,
                  roleIds: newValue,
                }))
              }
              roles={roles}
              searchValue={searchValue}
            />
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
  const shownRoles = roles.filter((role) => role.name.includes(searchValue))

  const allChecked = roleIds.every((a) => selectedRoleIds.includes(a))
  const isIndeterminate =
    roleIds.some((a) => selectedRoleIds.includes(a)) && !allChecked

  const { colorMode } = useColorMode()

  return (
    <>
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
    </>
  )
}

export default FilterByRoles
