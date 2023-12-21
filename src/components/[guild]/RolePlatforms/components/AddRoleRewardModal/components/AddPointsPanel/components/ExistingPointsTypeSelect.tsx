import {
  Center,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormContext } from "react-hook-form"
import Star from "static/icons/star.svg"

const ExistingPointsTypeSelect = ({ existingPointsRewards, selectedExistingId }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const options = existingPointsRewards
    .map((gp) => ({
      label: gp.platformGuildData.name || "points",
      value: gp.id,
      img: gp.platformGuildData.imageUrl ?? (
        <Center boxSize={5}>
          <Star />
        </Center>
      ),
    }))
    .concat({
      label: "Create new",
      value: null,
    })

  const selectedPointsImage = options.find(
    (option) => option.value === selectedExistingId
  )?.img

  return (
    <FormControl isInvalid={!!errors?.guildPlatformId} mb="5">
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
          name={`guildPlatformId`}
          control={control}
          options={options}
          beforeOnChange={(newValue) => {
            setValue("guildPlatformId", newValue?.label, {
              shouldDirty: false,
            })
          }}
        />
      </InputGroup>
      <FormErrorMessage>
        {errors?.guildPlatformId?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ExistingPointsTypeSelect
