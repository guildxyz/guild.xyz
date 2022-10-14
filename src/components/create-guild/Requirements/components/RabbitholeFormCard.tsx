import { Box, Center, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

const optionTopic = [
  { label: "DeFi", value: "DeFi" },
  { label: "NFTs", value: "NFTs" },
  { label: "DAOs", value: "DAOs" },
]

const optionLevel = [{ label: "Intro", value: "Intro" }]

const RabbitholeFormCard = ({ index, field }: Props) => {
  const baseFieldName = `requirements.${index}.data.params`

  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Box w="full">
        <FormLabel>WIP:</FormLabel>
        <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
          <FormControl>
            <Controller
              name={`${baseFieldName}.value`}
              control={control}
              //defaultValue={field.data?.params ?? ""}
              rules={{ required: "This field is required." }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <StyledSelect
                  ref={ref}
                  isClearable
                  options={optionLevel}
                  //value={optionLevel?.find((option) => option.value === value) ?? ""}
                  placeholder="Level"
                  onChange={(newSelectedOption: SelectOption) => {
                    onChange(newSelectedOption?.value)
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            {/* <FormErrorMessage>
              {errors?.requirements?.[index]?.data?.params?.credIssuence?.message}
            </FormErrorMessage> */}
          </FormControl>
          <Center>to</Center>
          <FormControl>
            <Controller
              name={`${baseFieldName}.trait_type`}
              control={control}
              defaultValue={field.data?.id ?? ""}
              rules={{ required: "This field is required." }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <StyledSelect
                  ref={ref}
                  isClearable
                  options={optionTopic}
                  // value={
                  //   optionTopic?.find((option) => option.trait_type === value) ?? ""
                  // }
                  placeholder="Topic"
                  onChange={(newSelectedOption: SelectOption) => {
                    onChange(newSelectedOption?.trait_type)
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            {/* <FormErrorMessage>
              {
                errors?.requirements?.[index]?.data?.params?.credIssuenceDate
                  ?.message
              }
            </FormErrorMessage> */}
          </FormControl>
        </Stack>
      </Box>
    </>
  )
}

export default RabbitholeFormCard
