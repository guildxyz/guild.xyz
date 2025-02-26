import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Skeleton } from "@/components/ui/Skeleton"
import { useFormContext, useWatch } from "react-hook-form"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import { RequirementFormProps } from "requirements/types"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import { useCovalentContractAbiMethods } from "../hooks/useCovalentContractAbiMethods"
import { CovalentContractCallCountChain } from "../types"
import { abiItemToFunctionSignature } from "../utils"
import { ContractMethodInputsFieldArray } from "./ContractMethodInputsFieldArray"
import TxCountFormControl from "./TxCountFormControl"

export const CovalentContractCallFields = ({
  field,
  baseFieldPath,
}: RequirementFormProps) => {
  const { control, resetField, getValues } = useFormContext()

  const chain: CovalentContractCallCountChain | undefined = useWatch({
    control,
    name: `${baseFieldPath}.chain`,
  })
  const contractAddress: string | undefined = useWatch({
    control,
    name: `${baseFieldPath}.address`,
  })

  const { data, isValidating } = useCovalentContractAbiMethods(
    chain,
    contractAddress
  )

  const methodOptions = data?.map((item) => ({
    label: abiItemToFunctionSignature(item, "PARAM_NAMES"),
    value: abiItemToFunctionSignature(item),
  }))

  return (
    <>
      <FormField
        control={control}
        name={`${baseFieldPath}.address`}
        rules={{
          pattern: {
            value: ADDRESS_REGEX,
            message: "Please paste a valid EVM address",
          },
        }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Contract address</FormLabel>
            <Input
              {...field}
              onChange={(e) => {
                resetField(`${baseFieldPath}.data.method`, {
                  defaultValue: "",
                })
                resetField(`${baseFieldPath}.data.inputs`, {
                  defaultValue: [],
                })
                resetField(`${baseFieldPath}.data.txCount`, {
                  defaultValue: 1,
                })
                resetField(`${baseFieldPath}.data.timestamps`, {
                  defaultValue: {},
                })
                field.onChange(e)
              }}
            />
            <FormErrorMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${baseFieldPath}.data.method`}
        rules={{
          required: "This field is required.",
        }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Contract method</FormLabel>
            {isValidating ? (
              <Skeleton className="h-10 w-full" />
            ) : !methodOptions ? (
              <Input {...field} disabled={!contractAddress} />
            ) : (
              <Select
                onValueChange={(e) => {
                  resetField(`${baseFieldPath}.data.inputs`, {
                    defaultValue: [],
                  })
                  resetField(`${baseFieldPath}.data.txCount`, {
                    defaultValue: 1,
                  })
                  resetField(`${baseFieldPath}.data.timestamps`, {
                    defaultValue: {},
                  })
                  field.onChange(e)
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-w-sm">
                  {methodOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <FormErrorMessage />
          </FormItem>
        )}
      />

      <ContractMethodInputsFieldArray baseFieldPath={baseFieldPath} />

      <TxCountFormControl
        baseFieldPath={baseFieldPath}
        formLabel="Number of contract calls"
      />

      <MinMaxAmount
        label={
          chain ? `${CHAIN_CONFIG[chain].nativeCurrency.symbol} amount` : "TX value"
        }
        field={field}
        baseFieldPath={baseFieldPath}
        format="FLOAT"
      />
    </>
  )
}
