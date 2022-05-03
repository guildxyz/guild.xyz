import { FormControl, FormLabel, Select, Text, Tooltip } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Info } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { Rest } from "types"

export type Channel = {
  id: number
  name: string
}

type Props = {
  channels: Channel[]
  label: string
  tooltip: string
  showCreateOption?: boolean
} & Rest

const EntryChannel = ({
  channels,
  label,
  tooltip,
  showCreateOption = false,
  ...rest
}: Props) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()

  return (
    <FormControl
      isInvalid={!!errors?.channelId}
      isDisabled={!channels?.length}
      defaultValue={channels?.[0]?.id}
    >
      <FormLabel d="flex" alignItems="center">
        <Text as="span" mr="2">
          {label}
        </Text>
        {/* not focusable so it doesn't automatically open on Guard modal open */}
        <Tooltip label={tooltip} /* shouldWrapChildren */>
          <Info />
        </Tooltip>
      </FormLabel>
      <Select {...register("channelId")} {...rest}>
        {showCreateOption && (
          <option value={0} defaultChecked>
            Create a new channel for me
          </option>
        )}
        {channels?.map((channel, i) => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{errors?.channelId?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default EntryChannel
