import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Separator } from "@/components/ui/Separator"
import { ComponentType } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps, RequirementType } from "requirements/types"
import { VeraxAttest } from "./VeraxAttest"
import { VeraxAttestedBy } from "./VeraxAttestedBy"

const typeOptions = [
  {
    value: "VERAX_ATTEST",
    label: "Attest",
    VeraxComponent: VeraxAttest,
  },
  {
    value: "VERAX_ATTESTED_BY",
    label: "Be attested by",
    VeraxComponent: VeraxAttestedBy,
  },
] as const satisfies {
  value: Extract<RequirementType, `VERAX_${string}`>
  label: string
  VeraxComponent: ComponentType<RequirementFormProps>
}[]

const VeraxForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const isEditMode = !!field?.id
  const { control, resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = typeOptions.find((reqType) => reqType.value === type)

  const resetForm = () => {
    resetField(`${baseFieldPath}.data.attester`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.subject`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.schemaId`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.key`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.val`, { defaultValue: "" })
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <FormField
        control={control}
        name={`${baseFieldPath}.type`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Verification level</FormLabel>
            <Select
              onValueChange={(e) => {
                resetForm()
                field.onChange(e)
              }}
              defaultValue={field.value}
              value={field.value}
              disabled={isEditMode}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select one..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {typeOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {!!selected && (
        <>
          <Separator />
          <selected.VeraxComponent baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </div>
  )
}

export default VeraxForm
