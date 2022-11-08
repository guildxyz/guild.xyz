import {
  Collapse,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useGateables from "hooks/useGateables"
import useServerData from "hooks/useServerData"
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import { FormCardProps } from "types"
import parseFromObject from "utils/parseFromObject"
import shortenHex from "utils/shortenHex"

const DiscordRole = ({ baseFieldPath }: FormCardProps) => {
  const { errors } = useFormState()
  const { register, setValue } = useFormContext()

  const { field: serverField } = useController({
    name: `${baseFieldPath}.data.serverId`,
    rules: {
      required: "Please select a server",
      pattern: {
        value: /^[0-9]*$/i,
        message: "Please input a valid Discord server id",
      },
    },
  })

  const { field: roleField } = useController({
    name: `${baseFieldPath}.data.roleId`,
    rules: {
      required: "Please select a role",
      pattern: {
        value: /^[0-9]*$/i,
        message: "Please input a valid Discord role id",
      },
    },
  })

  const { gateables, isLoading } = useGateables("DISCORD")

  const serverOptions = (gateables ?? []).map(({ img, name, id }) => ({
    value: id,
    img,
    label: name,
  }))

  const selectedServer = serverOptions.find(
    (reqType) => reqType.value === serverField.value
  )

  const isUnknownServer = !!serverField.value && !selectedServer

  const serverName = useWatch({
    name: `${baseFieldPath}.data.serverName`,
  })

  const {
    data: { roles },
    isLoading: isServerDataLoading,
  } = useServerData(selectedServer?.value)

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
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.serverId?.message}
      >
        <FormLabel>Server</FormLabel>
        <StyledSelect
          isCreatable
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          isLoading={isLoading}
          options={serverOptions}
          name={serverField.name}
          onBlur={serverField.onBlur}
          onChange={(newValue: {
            label: string
            value: string
            __isNew__?: boolean
          }) => {
            if (!newValue?.__isNew__) {
              setValue(`${baseFieldPath}.data.serverName`, newValue?.label)
            } else {
              setValue(`${baseFieldPath}.data.serverName`, undefined)
            }
            serverField.onChange(newValue?.value)
          }}
          ref={serverField.ref}
          value={
            selectedServer ?? {
              __isNew__: true,
              value: serverField.value,
              label: serverField.value,
            }
          }
        />

        <FormHelperText>Select a server or paste a server id</FormHelperText>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.serverId?.message}
        </FormErrorMessage>
      </FormControl>

      <Collapse in={isUnknownServer}>
        <FormControl
          isRequired
          isInvalid={
            !!parseFromObject(errors, baseFieldPath)?.data?.serverName?.message
          }
        >
          <FormLabel>Server name</FormLabel>
          <Input
            {...register(`${baseFieldPath}.data.serverName`, {
              required: isUnknownServer && "Please provide a server name",
            })}
          />

          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.serverName?.message}
          </FormErrorMessage>

          <FormHelperText>
            Future members will see this name in the requirement
          </FormHelperText>
        </FormControl>
      </Collapse>

      <FormControl
        isRequired
        isDisabled={
          !selectedServer &&
          (!serverField.value ||
            typeof serverName !== "string" ||
            serverName?.length <= 0 ||
            !!parseFromObject(errors, baseFieldPath)?.data?.serverName?.message ||
            !!parseFromObject(errors, baseFieldPath)?.data?.serverId?.message)
        }
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.roleId?.message}
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
              setValue(`${baseFieldPath}.data.roleName`, newValue?.label)
            } else {
              setValue(`${baseFieldPath}.data.roleName`, undefined)
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
          {parseFromObject(errors, baseFieldPath)?.data?.roleId?.message}
        </FormErrorMessage>

        <FormHelperText>Select a role or paste a role id</FormHelperText>
      </FormControl>

      <Collapse in={isUnknownRole}>
        <FormControl
          isRequired
          isInvalid={
            !!parseFromObject(errors, baseFieldPath)?.data?.roleName?.message
          }
        >
          <FormLabel>Role name</FormLabel>
          <Input
            {...register(`${baseFieldPath}.data.roleName`, {
              required: isUnknownRole && "Please provide a role name",
            })}
          />

          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.roleName?.message}
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
