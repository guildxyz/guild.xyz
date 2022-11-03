import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Chains } from "connectors"
import { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainPicker from "../ChainPicker"
import useLocks, { CHAINS_ENDPOINTS } from "./hooks/useLocks"

const supportedChains = Object.keys(CHAINS_ENDPOINTS).map(
  (chainId) => Chains[chainId]
)

type Props = {
  index: number
  field: Requirement
}

const customFilterOption = (candidate, input) =>
  candidate.label?.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value?.toLowerCase() === input?.toLowerCase()

const UnlockFormCard = ({ index }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })

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

  const pickedLock = useMemo(
    () => mappedLocks?.find((lock) => lock.value === address),
    [address, mappedLocks]
  )

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
  }

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        supportedChains={supportedChains}
        onChange={resetForm}
      />

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>Lock:</FormLabel>

        <InputGroup>
          {address && (
            <InputLeftElement>
              <OptionImage img={pickedLock?.img} alt={pickedLock?.label} />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.address` as const}
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
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export { supportedChains as unlockSupportedChains }
export default UnlockFormCard
