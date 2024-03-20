import { FormControl, FormLabel, Select } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useController } from "react-hook-form"
import { RoleEditFormData } from "../EditRole"

const RoleGroupSelect = () => {
  const { groups } = useGuild()

  const {
    field: { onChange, value, ...rest },
  } = useController<RoleEditFormData, "groupId">({
    name: "groupId",
  })

  if (!groups.length) return null

  return (
    <FormControl>
      <FormLabel>Add to page</FormLabel>
      <Select
        w={{ base: "full", sm: "52" }}
        {...rest}
        value={value ?? ""}
        onChange={(e) => {
          let valueAsNumber

          try {
            valueAsNumber = parseInt(e.target.value)
          } catch {}

          onChange(isNaN(valueAsNumber) ? null : valueAsNumber)
        }}
      >
        <option>Home page</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}
export default RoleGroupSelect
