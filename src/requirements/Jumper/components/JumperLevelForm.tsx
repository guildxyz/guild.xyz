import {
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"

export const JumperLevelForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={`${baseFieldPath}.data.minAmount`}
      rules={{
        required: true,
        min: 1,
      }}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Level</FormLabel>
          <Input
            type="number"
            {...field}
            onChange={(e) => {
              const newValue = e.target.value

              // We need this to allow typing in a decimal point
              if (/^[0-9]*\.[0-9]*0*$/i.test(newValue)) {
                field.onChange?.(newValue, Number(newValue))
                return field.onChange(newValue)
              }

              const parsedValue = parseInt(newValue)
              const returnedValue = isNaN(parsedValue) ? "" : parsedValue

              return field.onChange(returnedValue)
            }}
          />
          <FormErrorMessage />
        </FormItem>
      )}
    />
  )
}
