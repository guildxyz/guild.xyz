import {
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { VeraxCommonFields } from "./VeraxCommonFields"

export const VeraxAttestedBy = ({ baseFieldPath }: RequirementFormProps) => {
  const { control } = useFormContext()

  return (
    <>
      <VeraxCommonFields baseFieldPath={baseFieldPath} />

      <FormField
        control={control}
        name={`${baseFieldPath}.data.attester`}
        rules={{
          required: "This field is required.",
          pattern: {
            value: ADDRESS_REGEX,
            message:
              "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
          },
        }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Attester</FormLabel>
            <Input {...field} />
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </>
  )
}
