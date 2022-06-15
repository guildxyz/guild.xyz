import { Checkbox } from "@chakra-ui/react"
import { useController, useWatch } from "react-hook-form"

type Props = {
  categoryId: string
  channelId: string
}

const Channel = ({ categoryId, channelId }: Props) => {
  const {
    field: { name: fieldName, onBlur, onChange, ref },
  } = useController({ name: `gatedChannels.${categoryId}.channels.${channelId}` })

  const isChecked = useWatch({
    name: `gatedChannels.${categoryId}.channels.${channelId}.isChecked`,
  })

  const name = useWatch({
    name: `gatedChannels.${categoryId}.channels.${channelId}.name`,
  })

  return (
    <Checkbox
      name={fieldName}
      ref={ref}
      onBlur={onBlur}
      isChecked={isChecked}
      onChange={(e) => onChange({ name, isChecked: e.target.checked })}
    >
      {name}
    </Checkbox>
  )
}

export default Channel
