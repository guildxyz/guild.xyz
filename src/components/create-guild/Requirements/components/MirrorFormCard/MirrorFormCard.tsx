import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../ChainInfo"
import useMirrorEditions from "./hooks/useMirror"

const customFilterOption = (candidate, input) =>
  candidate?.label?.toLowerCase().includes(input?.toLowerCase()) ||
  candidate?.value?.toString().startsWith(input) ||
  candidate?.data?.address?.toLowerCase() === input.toLowerCase()

const MirrorFormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const id = useWatch({ name: `${baseFieldPath}.data.id` })
  const address = useWatch({ name: `${baseFieldPath}.address` })

  const { isLoading, editions } = useMirrorEditions()
  const mappedEditions = useMemo(
    () =>
      editions?.map((edition) => ({
        img: edition.image,
        label: edition.title,
        value: edition.editionId,
        details: `#${edition.editionId}`,
        address: edition.editionContractAddress,
      })),
    [editions]
  )

  const editionById = useMemo(
    () =>
      editions?.find(
        (edition) =>
          edition.editionId === parseInt(id) &&
          edition.editionContractAddress === address
      ) || null,
    [editions, id, address]
  )

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on ETHEREUM</ChainInfo>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Edition:</FormLabel>
        <InputGroup>
          {id && editionById && (
            <InputLeftElement>
              <OptionImage img={editionById?.image} alt={editionById?.title} />
            </InputLeftElement>
          )}
          <Controller
            name={`${baseFieldPath}.data.id` as const}
            control={control}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedEditions}
                placeholder="Search..."
                value={mappedEditions?.find(
                  (edition) =>
                    edition.value?.toString() == selectValue &&
                    edition.address?.toLowerCase() === address?.toLowerCase()
                )}
                onChange={(newValue: SelectOption) => {
                  onChange(newValue?.value)
                  setValue(`${baseFieldPath}.address`, newValue?.address)
                }}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default MirrorFormCard
