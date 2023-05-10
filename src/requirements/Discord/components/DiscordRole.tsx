import {
  Collapse,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import ReconnectAlert from "components/common/ReconnectAlert"
import useGateables from "hooks/useGateables"
import useServerData from "hooks/useServerData"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { PlatformType } from "types"
import parseFromObject from "utils/parseFromObject"
import shortenHex from "utils/shortenHex"
import ServerPicker from "./ServerPicker"

const DiscordRole = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()
  const { register, setValue } = useFormContext()

  const { error } = useGateables(PlatformType.DISCORD)

  const roleId = useWatch({ name: `${baseFieldPath}.data.roleId` })

  const serverId = useWatch({
    name: `${baseFieldPath}.data.serverId`,
  })
  const serverName = useWatch({
    name: `${baseFieldPath}.data.serverName`,
  })

  const {
    data: { roles },
    isValidating: isServerDataValidating,
  } = useServerData(serverId)

  const roleOptions = (roles ?? []).map(({ id, name }) => ({
    label: name,
    value: id,
    details: shortenHex(id),
  }))

  const selectedRole = roleOptions.find((reqType) => reqType.value === roleId)

  const isUnknownRole = !!roleId && !selectedRole

  return (
    <>
      <ServerPicker baseFieldPath={baseFieldPath} />

      <FormControl
        isRequired
        isDisabled={
          !serverId ||
          typeof serverName !== "string" ||
          serverName?.length <= 0 ||
          !!parseFromObject(errors, baseFieldPath)?.data?.serverName?.message ||
          !!parseFromObject(errors, baseFieldPath)?.data?.serverId?.message
        }
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.roleId?.message}
      >
        <FormLabel>Role</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.roleId`}
          rules={{
            required: "Please select a role",
            pattern: {
              value: /^[0-9]*$/i,
              message: "Please input a valid Discord role id",
            },
          }}
          noOptionsMessage={() => null}
          isCreatable
          isClearable
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          isLoading={isServerDataValidating}
          options={roleOptions}
          beforeOnChange={(newValue) => {
            if (!newValue?.__isNew__) {
              setValue(`${baseFieldPath}.data.roleName`, newValue?.label)
            } else {
              setValue(`${baseFieldPath}.data.roleName`, undefined)
            }
          }}
          fallbackValue={
            roleId && {
              __isNew__: true,
              value: roleId,
              label: roleId,
            }
          }
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.roleId?.message}
        </FormErrorMessage>

        <FormHelperText>Select a role or paste a role id</FormHelperText>
      </FormControl>

      <Collapse in={isUnknownRole} style={{ width: "100%" }}>
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

      {error && (
        <>
          <Divider />
          <ReconnectAlert platformName="DISCORD" />
        </>
      )}
    </>
  )
}

export default DiscordRole
