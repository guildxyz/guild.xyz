import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../common/ChainInfo"
import useGitPoaps from "./hooks/useGitPoaps"

const customOptionsFilter = (
  option: SelectOption<string>,
  inputValue: string
): boolean =>
  option.label.toLowerCase().includes(inputValue?.toLowerCase()) ||
  option?.details?.includes(inputValue)

const GitPoapForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    formState: { errors },
  } = useFormContext()

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

        <ControlledCombobox
          name={`${baseFieldPath}.data.id`}
          rules={{
            required: "This field is required.",
          }}
          isClearable
          isLoading={isPoapsLoading}
          options={mappedGitPoaps}
          placeholder="Search..."
          customOptionsFilter={customOptionsFilter}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default GitPoapForm
