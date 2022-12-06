import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import { useMemo, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useProposal from "../hooks/useProposal"
import useProposals from "../hooks/useProposals"

type Props = RequirementFormProps & {
  onChange?: (newValue: SelectOption) => void
}

const ProposalSelect = ({ baseFieldPath, onChange }: Props): JSX.Element => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const {
    field: { ref, name, value, onChange: controllerOnChange, onBlur },
  } = useController({
    name: `${baseFieldPath}.data.proposal`,
  })

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedState(search)

  const { proposals, isProposalsLoading } = useProposals(debouncedSearch)
  const mappedProposals = useMemo<SelectOption[]>(
    () =>
      proposals?.map((proposal) => ({
        label: proposal.title,
        value: proposal.id,
        details: proposal.state,
      })) ?? [],
    [proposals]
  )

  const { proposal, isProposalLoading } = useProposal(value)

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.proposal}
    >
      <FormLabel>Proposal</FormLabel>

      <StyledSelect
        ref={ref}
        name={name}
        placeholder="Search..."
        isClearable
        isLoading={isProposalsLoading || isProposalLoading}
        options={mappedProposals}
        value={proposal ? { label: proposal.title, value: proposal.id } : ""}
        onChange={(newValue: SelectOption) => {
          setValue(
            `${baseFieldPath}.data.space`,
            proposals?.find((p) => p.id === newValue.value)?.space?.id
          )
          controllerOnChange(newValue?.value)
          onChange?.(newValue)
        }}
        onInputChange={(text, _) => setSearch(text)}
        onBlur={onBlur}
      />

      <FormHelperText>Type at least 3 characters</FormHelperText>
    </FormControl>
  )
}

export default ProposalSelect
