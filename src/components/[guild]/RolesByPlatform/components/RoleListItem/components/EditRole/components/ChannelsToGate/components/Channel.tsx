import { Checkbox } from "@chakra-ui/react"
import { useController } from "react-hook-form"

type Props = {
  categoryId: string
  channelId: string
}

const Channel = ({ categoryId, channelId }: Props) => {
  const {
    field: {
      name: fieldName,
      onBlur,
      onChange,
      ref,
      value: { name, isChecked },
    },
  } = useController({ name: `gatedChannels.${categoryId}.channels.${channelId}` })

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
