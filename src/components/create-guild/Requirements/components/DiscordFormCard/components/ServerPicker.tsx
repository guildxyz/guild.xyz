import {
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import useGateables from "hooks/useGateables"
import { useController, useFormContext, useFormState } from "react-hook-form"

type Props = {
  index: number
}

const ServerPicker = ({ index }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { register, setValue } = useFormContext()

  const { field: serverField } = useController({
    name: `requirements.${index}.data.serverId`,
    rules: {
      required: "Please select a server",
      pattern: {
        value: /^[0-9]*$/i,
        message: "Please input a valid Discord server id",
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

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!errors?.requirements?.[index]?.data?.serverId?.message}
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
              setValue(`requirements.${index}.data.serverName`, newValue?.label)
            } else {
              setValue(`requirements.${index}.data.serverName`, undefined)
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
          {errors?.requirements?.[index]?.data?.serverId?.message}
        </FormErrorMessage>
      </FormControl>

      <Collapse
        in={!errors?.requirements?.[index]?.data?.serverId && isUnknownServer}
      >
        <FormControl
          isRequired
          isInvalid={!!errors?.requirements?.[index]?.data?.serverName?.message}
        >
          <FormLabel>Server name</FormLabel>
          <Input
            {...register(`requirements.${index}.data.serverName`, {
              required: isUnknownServer && "Please provide a server name",
            })}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.serverName?.message}
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
