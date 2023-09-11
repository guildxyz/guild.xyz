import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { Chains } from "connectors"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import useLocks, { CHAINS_ENDPOINTS } from "./hooks/useLocks"

const supportedChains = Object.keys(CHAINS_ENDPOINTS).map(
  (chainId) => Chains[chainId]
)

const customOptionsFilter = (
  option: SelectOption<string>,
  inputValue: string
): boolean =>
  option.label?.toLowerCase().includes(inputValue?.toLowerCase()) ||
  option.value?.toLowerCase() === inputValue?.toLowerCase()

const UnlockForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const { locks, isLoading } = useLocks(chain)
  const mappedLocks = useMemo(
    () =>
      locks?.map((lock) => ({
        img: lock.icon,
        label: lock.name,
        value: lock.address,
      })),
    [locks]
  )

  // Reset form on chain change
  const resetForm = () => {
    if (!parseFromObject(touchedFields, baseFieldPath)?.address) return
    setValue(`${baseFieldPath}.address`, null)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={supportedChains}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Lock:</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.address`}
          rules={{
            required: "This field is required.",
          }}
          isClearable
          isLoading={isLoading}
          options={mappedLocks}
          placeholder="Search..."
          customOptionsFilter={customOptionsFilter}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export { supportedChains as unlockSupportedChains }
export default UnlockForm
