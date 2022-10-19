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
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../ChainInfo"
import useGitPoaps from "./hooks/useGitPoaps"

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const GitPoapFormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}type` })

  const dataId = useWatch({ name: `${baseFieldPath}data.id`, control })
  const { poap: poapDetails } = usePoap(dataId)

  const { isLoading: isPoapsLoading, gitPoaps } = useGitPoaps()

  const mappedGitPoaps = useMemo(
    () =>
      gitPoaps?.map((p) => ({
        img: p.imageUrl,
        label: p.name?.replace("GitPOAP: ", ""),
        value: p.poapEventFancyId,
        details: `#${p.poapEventId}`,
      })) ?? [],
    [gitPoaps]
  )

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on both ETHEREUM and GNOSIS</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && !!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>GitPOAP:</FormLabel>
        <InputGroup>
          {poapDetails && (
            <InputLeftElement>
              <OptionImage img={poapDetails?.image_url} alt={poapDetails?.name} />
            </InputLeftElement>
          )}
          <Controller
            name={`${baseFieldPath}data.id` as const}
            control={control}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isPoapsLoading}
                options={mappedGitPoaps}
                placeholder="Search..."
                value={mappedGitPoaps?.find((p) => p.value === selectValue)}
                onChange={(newValue: SelectOption) => onChange(newValue?.value)}
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

export default GitPoapFormCard
