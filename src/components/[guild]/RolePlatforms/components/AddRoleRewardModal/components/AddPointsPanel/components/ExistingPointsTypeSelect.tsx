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
import { AddPointsFormType } from "../AddPointsPanel"

type Props = {
  fieldName?: string
  existingPointsRewards: GuildPlatform[]
  selectedExistingId: number | undefined
  isLoading?: boolean
  showCreateNew?: boolean
} & FormControlProps

export const CREATE_NEW_OPTION = -1

const ExistingPointsTypeSelect = ({
  fieldName = "data.guildPlatformId",
  existingPointsRewards,
  selectedExistingId,
  isLoading,
  showCreateNew,
  ...rest
}: Props) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AddPointsFormType>()
  const options = useMemo(() => {
    const result = existingPointsRewards?.map((gp) => ({
      label: gp?.platformGuildData?.name || "points",
      value: gp.id,
      img: gp?.platformGuildData?.imageUrl ?? (
        <Center boxSize={5}>
          <Star />
        </Center>
      ),
    }))

    if (!showCreateNew) return result

    return result.concat({
      label: "Create new",
      value: CREATE_NEW_OPTION,
      img: "",
    })
  }, [existingPointsRewards, showCreateNew])

  const selectedPointsImage = options?.find(
    (option) => option.value === selectedExistingId
  )?.img

  return (
    <FormControl isInvalid={!!parseFromObject(errors, fieldName)} {...rest}>
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
          name={fieldName}
          control={control as any}
          options={options}
          beforeOnChange={(newValue) => {
            setValue(fieldName as any, newValue?.id, {
              shouldDirty: false,
            })
          }}
          isLoading={isLoading}
        />
      </InputGroup>
      <FormErrorMessage>
        {parseFromObject(errors, fieldName)?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ExistingPointsTypeSelect
