import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"

const VERIFICATION_LEVEL_OPTIONS = [
  {
    label: "Device",
    value: "device",
  },
  {
    label: "Orb",
    value: "orb",
  },
] as const

const WorldIDForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { control } = useFormContext()

  return (
    <div className="flex flex-col items-start gap-4">
      <FormField
        control={control}
        name={`${baseFieldPath}.data.id`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Verification level</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select one..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VERIFICATION_LEVEL_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  )
}

export default WorldIDForm
