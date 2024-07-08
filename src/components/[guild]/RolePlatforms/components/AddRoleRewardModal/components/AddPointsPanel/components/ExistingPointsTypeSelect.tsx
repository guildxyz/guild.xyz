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
import { FormProvider, useForm } from "react-hook-form"
import Star from "static/icons/star.svg"
import { GuildPlatform } from "types"

type Props = {
  existingPointsRewards: GuildPlatform[]
  selectedExistingId: number | undefined
  isLoading?: boolean
  showCreateNew?: boolean
  onDone: (id: number) => void
} & FormControlProps

export const CREATE_NEW_OPTION = -1

const ExistingPointsTypeSelect = ({
  existingPointsRewards,
  selectedExistingId,
  isLoading,
  showCreateNew,
  onDone,
  ...rest
}: Props) => {
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

  const methods = useForm<{ selectedId?: number | null }>({
    defaultValues: {
      selectedId: options?.[0]?.value || null,
    },
  })
  const {
    formState: { errors },
    control,
  } = methods

  return (
    <FormProvider {...methods}>
      <FormControl isInvalid={!!errors?.selectedId} {...rest}>
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
            name={"selectedId"}
            control={control as any}
            options={options}
            afterOnChange={(newValue: any) => {
              onDone(newValue?.value)
            }}
            isLoading={isLoading}
          />
        </InputGroup>
        <FormErrorMessage>{errors?.selectedId?.message}</FormErrorMessage>
      </FormControl>
    </FormProvider>
  )
}

export default ExistingPointsTypeSelect
