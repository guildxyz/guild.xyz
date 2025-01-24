import {
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"

export const JumperTypeForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={`${baseFieldPath}.data.rewardType`}
      rules={{
        required: true,
        minLength: 1,
      }}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Reward type</FormLabel>
          <Input {...field} />
          <FormErrorMessage />
        </FormItem>
      )}
    />
  )
}
