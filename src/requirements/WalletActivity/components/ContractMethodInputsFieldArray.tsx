import { Button } from "@/components/ui/Button"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { Requirement } from "@guildxyz/types"
import { Plus, TrashSimple } from "@phosphor-icons/react/dist/ssr"
import { useMemo } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import { SelectOption } from "types"
import { useCovalentContractAbiMethods } from "../hooks/useCovalentContractAbiMethods"
import { CovalentContractCallCountChain } from "../types"
import { abiItemToFunctionSignature } from "../utils"

type InputType = NonNullable<
  Extract<
    Requirement,
    {
      type: "COVALENT_CONTRACT_CALL_COUNT" | "COVALENT_CONTRACT_CALL_COUNT_RELATIVE"
    }
  >["data"]["inputs"]
>[number]

// TODO: export this from the types package?
const OP_OPTIONS = [
  "equal",
  "not_equal",
  "greater",
  "greater_or_equal",
  "less",
  "less_or_equal",
  "array_last_equal",
] as const

const OP_LABELS = {
  equal: "Equal",
  not_equal: "Not equal",
  greater: "Greater than",
  greater_or_equal: "Greater or equal",
  less: "Less",
  less_or_equal: "Less or equal",
  array_last_equal: "Last item equals",
} satisfies Record<(typeof OP_OPTIONS)[number], string>

export const ContractMethodInputsFieldArray = ({
  baseFieldPath,
}: RequirementFormProps) => {
  const { control } = useFormContext()

  const chain: CovalentContractCallCountChain | undefined = useWatch({
    control,
    name: `${baseFieldPath}.chain`,
  })
  const address: string | undefined = useWatch({
    control,
    name: `${baseFieldPath}.address`,
  })

  const { data, isValidating } = useCovalentContractAbiMethods(chain, address)

  const method: string | undefined = useWatch({
    control,
    name: `${baseFieldPath}.data.method`,
  })

  const paramOptions = useMemo<SelectOption<number>[] | undefined>(() => {
    if (!method || !data) return undefined
    const inputs = data.find(
      (item) => abiItemToFunctionSignature(item) === method
    )?.inputs

    if (!inputs) return undefined

    return inputs.map(
      (input, index) =>
        ({
          label: input.name
            ? `${input.name} ${input.type}`
            : `${input.type} (index: ${index})`,
          value: index,
        }) satisfies SelectOption<number>
    )
  }, [data, method])

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${baseFieldPath}.data.inputs`,
  })

  const addInputDisabledText = !method
    ? "Specify a method first"
    : method.trim().startsWith("0x")
      ? "You can't specify inputs if method is defined as a raw bytes function signature"
      : method.trim().endsWith("()")
        ? "This method doesn't have any input parameters"
        : undefined

  return (
    <FormItem className="w-full">
      <FormLabel>Inputs</FormLabel>

      <div
        className={cn("grid gap-1", {
          "pointer-events-none opacity-50": isValidating,
        })}
      >
        {fields.map(({ id }, index) => (
          <div
            key={id}
            className="grid gap-1 rounded-xl bg-blackAlpha-soft p-2 dark:bg-blackAlpha"
          >
            <div className="flex items-center">
              <div className="flex h-10 min-w-max items-center rounded-l-lg border border-input-border border-r-0 bg-card px-2 text-sm">
                Param
              </div>
              <FormField
                control={control}
                name={`${baseFieldPath}.data.inputs.${index}.index`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    {paramOptions ? (
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        defaultValue={String(field.value)}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-l-none">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paramOptions.map((param) => (
                            // TODO: value as number?...
                            <SelectItem
                              key={param.value}
                              value={String(param.value)}
                            >
                              {param.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input type="number" {...field} className="rounded-l-none" />
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`${baseFieldPath}.data.inputs.${index}.operator`}
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OP_OPTIONS.map((operation) => (
                        <SelectItem key={operation} value={operation}>
                          {OP_LABELS[operation]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${baseFieldPath}.data.inputs.${index}.value`}
              rules={{
                required: "This field is required",
              }}
              render={({ field }) => (
                <FormItem>
                  <Input {...field} placeholder="Specify a value" />
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            <Button
              leftIcon={<TrashSimple weight="bold" />}
              size="xs"
              className="ml-auto rounded-md"
              colorScheme="destructive"
              variant="ghost"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Tooltip open={!addInputDisabledText ? false : undefined}>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                leftIcon={<Plus weight="bold" />}
                onClick={() =>
                  append({
                    index: 0,
                    operator: "equal",
                    value: "",
                  } satisfies InputType)
                }
                disabled={!!addInputDisabledText}
                className="w-full"
              >
                Add more
              </Button>
            </div>
          </TooltipTrigger>

          <TooltipContent>
            <p>{addInputDisabledText}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </FormItem>
  )
}
