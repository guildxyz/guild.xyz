import { FormControl, FormLabel, Select, Text, Tooltip } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Info } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Rest } from "types"

export type Channel = {
  id: string
  name: string
}

type Props = {
  channels: Channel[]
  label: string
  tooltip?: string
  showCreateOption?: boolean
  withAction?: boolean
  fieldName: string
  errorMessage?: string
} & Rest

const EntryChannel = ({
  channels,
  label,
  tooltip,
  showCreateOption = false,
  withAction,
  fieldName,
  errorMessage,
  ...rest
}: Props) => {
  const { register, setValue } = useFormContext()

  const channelId = useWatch({ name: "channelId" })

  useEffect(() => {
    if (!channels?.some(({ id }) => id === channelId)) {
      setValue(fieldName, !showCreateOption ? channels?.[0]?.id : "0")
    }
  }, [channelId, channels, setValue, fieldName, showCreateOption])

  return (
    <FormControl isInvalid={!!errorMessage} defaultValue={channels?.[0]?.id}>
      <FormLabel display="flex" alignItems="center">
        <Text as="span" mr="2">
          {label}
        </Text>
        {/* not focusable so it doesn't automatically open on modal open */}
        {tooltip && (
          <Tooltip label={tooltip} /* shouldWrapChildren */>
            <Info tabIndex={withAction ? 0 : undefined} />
          </Tooltip>
        )}
      </FormLabel>
      <Select {...register(fieldName)} {...rest}>
        {showCreateOption && (
          <option value={0} defaultChecked>
            Create a new channel for me
          </option>
        )}
        {channels?.map((channel) => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  )
}

export default EntryChannel
