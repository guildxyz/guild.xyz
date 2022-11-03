import {
  Collapse,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useServerData from "hooks/useServerData"
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import shortenHex from "utils/shortenHex"
import ServerPicker from "./ServerPicker"

type Props = {
  index: number
}

const DiscordRole = ({ index }: Props) => {
  const { errors } = useFormState()
  const { register, setValue } = useFormContext()

  const { field: roleField } = useController({
    name: `requirements.${index}.data.roleId`,
    rules: {
      required: "Please select a role",
      pattern: {
        value: /^[0-9]*$/i,
        message: "Please input a valid Discord role id",
      },
    },
  })

  const serverId = useWatch({
    name: `requirements.${index}.data.serverId`,
  })
  const serverName = useWatch({
    name: `requirements.${index}.data.serverName`,
  })

  const {
    data: { roles },
    isLoading: isServerDataLoading,
  } = useServerData(serverId)

  const roleOptions = (roles ?? []).map(({ id, name }) => ({
    label: name,
    value: id,
    details: shortenHex(id),
  }))

  const selectedRole = roleOptions.find(
    (reqType) => reqType.value === roleField.value
  )

  const isUnknownRole = !!roleField.value && !selectedRole

  return (
    <>
      <ServerPicker index={index} />

      <FormControl
        isRequired
        isDisabled={
          !serverId ||
          typeof serverName !== "string" ||
          serverName?.length <= 0 ||
          !!errors?.requirements?.[index]?.data?.serverName?.message ||
          !!errors?.requirements?.[index]?.data?.serverId?.message
        }
        isInvalid={!!errors?.requirements?.[index]?.data?.roleId?.message}
      >
        <FormLabel>Role</FormLabel>
        <StyledSelect
          noOptionsMessage={() => null}
          isCreatable
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          isLoading={isServerDataLoading}
          options={roleOptions}
          name={roleField.name}
          onBlur={roleField.onBlur}
          onChange={(newValue: {
            label: string
            value: string
            __isNew__?: boolean
          }) => {
            if (!newValue?.__isNew__) {
              setValue(`requirements.${index}.data.roleName`, newValue?.label)
            } else {
              setValue(`requirements.${index}.data.roleName`, undefined)
            }
            roleField.onChange(newValue?.value)
          }}
          ref={roleField.ref}
          value={
            selectedRole ?? {
              __isNew__: true,
              value: roleField.value,
              label: roleField.value,
            }
          }
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.roleId?.message}
        </FormErrorMessage>

        <FormHelperText>Select a role or paste a role id</FormHelperText>
      </FormControl>

      <Collapse in={isUnknownRole}>
        <FormControl
          isRequired
          isInvalid={!!errors?.requirements?.[index]?.data?.roleName?.message}
        >
          <FormLabel>Role name</FormLabel>
          <Input
            {...register(`requirements.${index}.data.roleName`, {
              required: isUnknownRole && "Please provide a role name",
            })}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.roleName?.message}
          </FormErrorMessage>

          <FormHelperText>
            Future members will see this name as the requirement
          </FormHelperText>
        </FormControl>
      </Collapse>
    </>
  )
}

export default DiscordRole
