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
import { AddPointsFormType } from "../AddPointsPanel"

type Props = {
  existingPointsRewards: GuildPlatform[]
  selectedExistingId: number
  isLoading?: boolean
  showCreateNew?: boolean
} & FormControlProps

const ExistingPointsTypeSelect = ({
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
    <FormControl isInvalid={!!errors?.data?.guildPlatformId} {...rest}>
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
          name={`data.guildPlatformId`}
          control={control as any}
          options={options}
          beforeOnChange={(newValue) => {
            setValue("data.guildPlatformId", newValue?.id as any, {
              shouldDirty: false,
            })
          }}
          isLoading={isLoading}
        />
      </InputGroup>
      <FormErrorMessage>
        {errors?.data?.guildPlatformId?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ExistingPointsTypeSelect
