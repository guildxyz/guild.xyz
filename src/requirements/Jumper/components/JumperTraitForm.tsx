import {
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"

export const JumperTraitForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { control } = useFormContext()

  return (
    <>
      <FormField
        control={control}
        name={`${baseFieldPath}.data.category`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Category</FormLabel>
            <Input {...field} />
            <FormErrorMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${baseFieldPath}.data.name`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Name</FormLabel>
            <Input {...field} />
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </>
  )
}
