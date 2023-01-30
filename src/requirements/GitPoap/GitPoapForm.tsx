import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../common/ChainInfo"
import useGitPoaps from "./hooks/useGitPoaps"

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const GitPoapForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const dataId = useWatch({ name: `${baseFieldPath}.data.id`, control })
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
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>GitPOAP:</FormLabel>
        <InputGroup>
          {poapDetails && (
            <InputLeftElement>
              <OptionImage img={poapDetails?.image_url} alt={poapDetails?.name} />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{
              required: "This field is required.",
            }}
            isClearable
            isLoading={isPoapsLoading}
            options={mappedGitPoaps}
            placeholder="Search..."
            filterOption={customFilterOption}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default GitPoapForm
