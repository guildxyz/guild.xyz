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
import { RequirementFormProps } from "requirements/types"
import { JumperLevelForm } from "./components/JumperLevelForm"
import { JumperTraitForm } from "./components/JumperTraitForm"
import { JumperTypeForm } from "./components/JumperTypeForm"
import { JumperRequirementType } from "./types"

const jumperRequirementTypes = [
  {
    label: "Have at least level x",
    value: "JUMPER_LEVEL",
    JumperRequirement: JumperLevelForm,
  },
  {
    label: "Have an achievement of a certain type",
    value: "JUMPER_TYPE",
    JumperRequirement: JumperTypeForm,
  },
  {
    label: "Have a trait",
    value: "JUMPER_TRAITS",
    JumperRequirement: JumperTraitForm,
  },
] satisfies {
  label: string
  value: JumperRequirementType
  JumperRequirement: ComponentType<RequirementFormProps>
}[]

const JumperForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { control, resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const selected = jumperRequirementTypes.find((reqType) => reqType.value === type)

  const resetForm = () => {
    resetField(`${baseFieldPath}.data.minAmount`, { defaultValue: undefined })
    resetField(`${baseFieldPath}.data.rewardType`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.category`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.name`, { defaultValue: "" })
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <FormField
        control={control}
        name={`${baseFieldPath}.type`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Type</FormLabel>
            <Select
              onValueChange={(e) => {
                resetForm()
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
              <SelectContent>
                {jumperRequirementTypes.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {selected?.JumperRequirement && (
        <>
          <Separator />
          <selected.JumperRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </div>
  )
}

export default JumperForm
