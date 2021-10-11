import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const WhitelistFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    getValues,
    trigger,
    formState: { errors },
    control,
  } = useFormContext()

  const type = getValues(`requirements.${index}.type`)
  const data = useWatch({ name: `requirements.${index}.data` })

  const validAddress = (address: string) => ADDRESS_REGEX.test(address)

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
      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.data}>
        <FormLabel>Whitelisted addresses:</FormLabel>
        <Controller
          control={control}
          name={`requirements.${index}.data`}
          rules={{
            required: "This field is required.",
            validate: () =>
              data?.every(validAddress) || "Please input only valid addresses!",
          }}
          render={({ field: { onChange, ref } }) => (
            <Textarea
              inputRef={ref}
              resize="vertical"
              placeholder="Paste addresses, each one in a new line"
              p={2}
              fontSize="sm"
              onChange={(e) =>
                onChange(
                  e.target.value?.split("\n").filter((address) => address !== "")
                )
              }
              onBlur={() => trigger(`requirements.${index}.data`)}
            />
          )}
        />

        <FormHelperText>Paste addresses, each one in a new line</FormHelperText>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.message}
        </FormErrorMessage>
      </FormControl>
    </ColorCard>
  )
}

export default WhitelistFormCard
