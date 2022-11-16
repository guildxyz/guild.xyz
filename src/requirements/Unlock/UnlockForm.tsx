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
import { Chains } from "connectors"
import { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import useLocks, { CHAINS_ENDPOINTS } from "./hooks/useLocks"

const supportedChains = Object.keys(CHAINS_ENDPOINTS).map(
  (chainId) => Chains[chainId]
)

const customFilterOption = (candidate, input) =>
  candidate.label?.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value?.toLowerCase() === input?.toLowerCase()

const UnlockForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })

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

  const pickedLock = mappedLocks?.find((lock) => lock.value === address)

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

        <InputGroup>
          {address && (
            <InputLeftElement>
              <OptionImage img={pickedLock?.img} alt={pickedLock?.label} />
            </InputLeftElement>
          )}
          <Controller
            name={`${baseFieldPath}.address` as const}
            control={control}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedLocks}
                placeholder="Search..."
                value={
                  value ? mappedLocks?.find((lock) => lock.value === value) : ""
                }
                onChange={(selectedOption: SelectOption) =>
                  onChange(selectedOption?.value)
                }
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export { supportedChains as unlockSupportedChains }
export default UnlockForm
