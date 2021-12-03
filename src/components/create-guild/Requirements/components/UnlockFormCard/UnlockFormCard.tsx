import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
} from "@chakra-ui/react"
import { Select } from "components/common/ChakraReactSelect"
import { Chains } from "connectors"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField } from "temporaryData/types"
import ChainPicker from "../ChainPicker"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import useLocks, { UNLOCKSUBGRAPHS } from "./hooks/useLocks"

type Props = {
  index: number
  field: RequirementFormField
  onRemove: () => void
}

const UnlockFormCard = ({ index, field, onRemove }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })

  // Storing the user input value in local state, so we can show the dropdown only of the input's length is > 0
  const [addressInput, setAddressInput] = useState("")

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
  useEffect(() => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
  }, [chain])

  return (
    <FormCard type={field.type} onRemove={onRemove}>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        supportedChains={Object.keys(UNLOCKSUBGRAPHS).map(
          (chainId) => Chains[chainId]
        )}
      />

      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.address}>
        <FormLabel>Token:</FormLabel>

        <InputGroup>
          {address && (
            <Symbol
              symbol={pickedLock?.img}
              isInvalid={errors?.requirements?.[index]?.address}
            />
          )}
          <Controller
            name={`requirements.${index}.address` as const}
            control={control}
            defaultValue={field.address}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Select
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedLocks}
                placeholder="Search..."
                value={mappedLocks?.find((lock) => lock.value === value)}
                defaultValue={mappedLocks?.find(
                  (lock) => lock.value === field.address
                )}
                onChange={(selectedOption) => onChange(selectedOption?.value)}
                onBlur={onBlur}
                onInputChange={(text, _) => setAddressInput(text)}
                filterOption={(candidate, input) =>
                  candidate.label?.toLowerCase().includes(input?.toLowerCase()) ||
                  candidate.value?.toLowerCase() === input?.toLowerCase()
                }
                menuIsOpen={addressInput?.length > 1}
                // Hiding the dropdown indicator
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
              />
            )}
          />
        </InputGroup>

        <FormHelperText>Type at least 2 characters.</FormHelperText>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </FormCard>
  )
}

export default UnlockFormCard
