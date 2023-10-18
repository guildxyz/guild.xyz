import { CheckboxGroup, CheckboxGroupProps, Stack } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Role } from "types"
import useGroup from "./hooks/useGroup"
import RoleOptionCard from "./RoleOptionCard"

type Props = {
  roles: Role[]
  size?: "md" | "lg"
  allowMultiple?: boolean
} & CheckboxGroupProps

const DynamicNoRolesAlert = dynamic(() => import("components/[guild]/NoRolesAlert"))

const RoleSelector = ({
  roles,
  size,
  allowMultiple = true,
  onChange,
  ...checkboxGroupProps
}: Props) => {
  const [value, setValue] = useState<(string | number)[]>()

  const group = useGroup()

  if (!roles?.length) return <DynamicNoRolesAlert type={group ? "GROUP" : "GUILD"} />

  return (
    <CheckboxGroup
      onChange={(newValue) => {
        const valueToSet = allowMultiple
          ? newValue
          : newValue.filter((o) => !value?.includes(o))

        setValue(valueToSet)
        onChange?.(valueToSet)
      }}
      value={value}
      colorScheme="primary"
      {...checkboxGroupProps}
    >
      <Stack>
        {roles.map((role) => (
          <RoleOptionCard
            key={role.id}
            role={role}
            size={size}
            isDisabled={
              allowMultiple
                ? false
                : value?.length > 0 && !value.includes(role.id.toString())
            }
          />
        ))}
      </Stack>
    </CheckboxGroup>
  )
}

export default RoleSelector
