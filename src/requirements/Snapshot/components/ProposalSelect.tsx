import { FormControl, FormLabel } from "@chakra-ui/react"
import { ControlledCombobox } from "components/zag/Combobox"
import useDebouncedState from "hooks/useDebouncedState"
import { useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useProposals from "../hooks/useProposals"

type Props = RequirementFormProps & {
  onChange?: (newValue: SelectOption) => void
}

const ProposalSelect = ({ baseFieldPath, onChange }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const spaceId = useWatch({ control, name: `${baseFieldPath}.data.space` })

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedState(search)

  const { proposals, isProposalsLoading } = useProposals(debouncedSearch, spaceId)
  const mappedProposals = useMemo<SelectOption[]>(
    () =>
      proposals?.map((p) => ({
        label: p.title,
        value: p.id,
        details: p.state,
      })) ?? [],
    [proposals]
  )

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.proposal}
    >
      <FormLabel>Proposal</FormLabel>

      <ControlledCombobox
        name={`${baseFieldPath}.data.proposal`}
        placeholder="Search..."
        isClearable
        isLoading={isProposalsLoading}
        options={mappedProposals}
        onInputChange={(text) => setSearch(text)}
        beforeOnChange={(newValue) =>
          setValue(
            `${baseFieldPath}.data.space`,
            proposals?.find((p) => p.id === newValue?.value)?.space?.id
          )
        }
        afterOnChange={(newValue) => onChange?.(newValue)}
        noOptionsText={
          !spaceId && debouncedSearch?.length < 3
            ? "Start typing..."
            : isProposalsLoading
            ? "Loading"
            : "No results"
        }
      />
    </FormControl>
  )
}

export default ProposalSelect
