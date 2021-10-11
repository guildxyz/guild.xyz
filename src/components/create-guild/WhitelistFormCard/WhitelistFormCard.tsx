import { CloseButton } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import { useFormContext } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"

type Props = {
  index: number
  onRemove?: () => void
}

const WhitelistFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()

  const type = getValues(`requirements.${index}.type`)

  return (
    <ColorCard color={RequirementTypeColors[type]}>
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          zIndex="1"
          onClick={onRemove}
        />
      )}
      WIP
    </ColorCard>
  )
}

export default WhitelistFormCard
