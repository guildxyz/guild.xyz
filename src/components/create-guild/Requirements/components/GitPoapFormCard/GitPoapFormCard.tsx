import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainInfo from "../ChainInfo"
import useGitPoaps from "./hooks/useGitPoaps"

type Props = {
  index: number
  field: Requirement
}

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const GitPoapFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const type = useWatch({ name: `requirements.${index}.type` })

  const dataId = useWatch({ name: `requirements.${index}.data.id`, control })
  const { poap: poapDetails } = usePoap(dataId)

  const { isLoading: isPoapsLoading, gitPoaps } = useGitPoaps()

  const mappedGitPoaps = useMemo(
    () =>
      gitPoaps?.map((p) => ({
        img: p.imageUrl,
        label: p.name,
        value: p.poapEventFancyId,
        details: `#${p.poapEventId}`,
      })) ?? [],
    [gitPoaps]
  )

  return (
    <>
      <ChainInfo>Works on both ETHEREUM and GNOSIS</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && !!errors?.requirements?.[index]?.data?.id}
      >
        <FormLabel>GitPOAP:</FormLabel>
        <InputGroup>
          {poapDetails && (
            <InputLeftElement>
              <OptionImage img={poapDetails?.image_url} alt={poapDetails?.name} />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data?.id}
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
                defaultValue={mappedGitPoaps?.find(
                  (p) => p.value === field.data?.id
                )}
                onChange={(newValue: SelectOption) => onChange(newValue?.value)}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GitPoapFormCard
