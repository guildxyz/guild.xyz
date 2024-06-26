import {
  Center,
  FormControl,
  FormControlProps,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import Star from "static/icons/star.svg"
import { GuildPlatform } from "types"
import parseFromObject from "utils/parseFromObject"

type Props = {
  existingPointsRewards: GuildPlatform[]
  selectedExistingId: number
  isLoading?: boolean
  showCreateNew?: boolean
  fieldPath?: string
} & FormControlProps

const ExistingPointsTypeSelect = ({
  existingPointsRewards,
  selectedExistingId,
  isLoading,
  showCreateNew,
  fieldPath = "data.guildPlatformId",
  ...rest
}: Props) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const options = useMemo(() => {
    const result = existingPointsRewards?.map((gp) => ({
      label: gp.platformGuildData.name || "points",
      value: gp.id,
      img: gp.platformGuildData.imageUrl ?? (
        <Center boxSize={5}>
          <Star />
        </Center>
      ),
    }))

    if (!showCreateNew) return result

    return result.concat({
      label: "Create new",
      value: null,
      img: null,
    })
  }, [existingPointsRewards, showCreateNew])

  const selectedPointsImage = options?.find(
    (option) => option.value === selectedExistingId
  )?.img

  return (
    <FormControl isInvalid={!!parseFromObject(errors, fieldPath)} {...rest}>
      <FormLabel>Points type</FormLabel>
      <InputGroup>
        {selectedPointsImage && (
          <InputLeftElement>
            {typeof selectedPointsImage === "string" ? (
              <OptionImage img={selectedPointsImage} alt="Points icon" />
            ) : (
              selectedPointsImage
            )}
          </InputLeftElement>
        )}
        <ControlledSelect
          name={fieldPath}
          control={control as any}
          options={options}
          beforeOnChange={(newValue) => {
            setValue(fieldPath, newValue?.id, {
              shouldDirty: false,
            })
          }}
          isLoading={isLoading}
        />
      </InputGroup>
      <FormErrorMessage>
        {parseFromObject(errors, fieldPath)?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ExistingPointsTypeSelect
