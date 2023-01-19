import {
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGateables from "hooks/useGateables"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const ServerPicker = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { register, setValue } = useFormContext()

  const serverId = useWatch({ name: `${baseFieldPath}.data.serverId` })

  const { gateables, isLoading } = useGateables("DISCORD")

  const serverOptions = (gateables ?? []).map(({ img, name, id }) => ({
    value: id,
    img,
    label: name,
  }))

  const selectedServer = serverOptions.find((reqType) => reqType.value === serverId)

  const isUnknownServer = !!serverId && !selectedServer

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.serverId?.message}
      >
        <FormLabel>Server</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.serverId`}
          rules={{
            required: "Please select a server",
            pattern: {
              value: /^[0-9]*$/i,
              message: "Please input a valid Discord server id",
            },
          }}
          isCreatable
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          isLoading={isLoading}
          options={serverOptions}
          beforeOnChange={(newValue) => {
            if (!newValue?.__isNew__) {
              setValue(`${baseFieldPath}.data.serverName`, newValue?.label)
            } else {
              setValue(`${baseFieldPath}.data.serverName`, undefined)
            }
          }}
          fallbackValue={
            serverId && {
              __isNew__: true,
              value: serverId,
              label: serverId,
            }
          }
        />

        <FormHelperText>Select a server or paste a server id</FormHelperText>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.serverId?.message}
        </FormErrorMessage>
      </FormControl>

      <Collapse in={isUnknownServer} style={{ width: "100%" }}>
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
    </>
  )
}

export default ServerPicker
