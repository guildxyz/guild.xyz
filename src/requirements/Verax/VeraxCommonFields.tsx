import {
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import { HEX_STRING_REGEX } from "./constants"

export const VeraxCommonFields = ({ baseFieldPath }: RequirementFormProps) => {
  const { control } = useFormContext()

  return (
    <>
      <FormField
        control={control}
        name={`${baseFieldPath}.data.schemaId`}
        rules={{
          required: "This field is required.",
          pattern: {
            value: HEX_STRING_REGEX,
            message: "Please input a 0x-prefixed hexadecimal schema id.",
          },
        }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Schema ID</FormLabel>
            <Input {...field} />
            <FormErrorMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${baseFieldPath}.data.key`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Key</FormLabel>
            <Input {...field} />
            <FormErrorMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${baseFieldPath}.data.val`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Value</FormLabel>
            <Input {...field} />
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </>
  )
}
