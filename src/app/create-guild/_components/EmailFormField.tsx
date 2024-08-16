import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import useUser from "components/[guild]/hooks/useUser"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { CreateGuildFormType } from "../types"

const EmailFormField = () => {
  const {
    control,
    setValue,
    formState: { touchedFields },
  } = useFormContext<CreateGuildFormType>()
  const { emails, platformUsers } = useUser()

  const providedEmail = useWatch({ control, name: "contacts.0.contact" })
  useEffect(() => {
    if (!!providedEmail || touchedFields.contacts?.[0]?.contact) return

    const emailAddress = emails?.emailAddress
    const googleEmailAddress = platformUsers?.find(
      (pu) => pu.platformName === "GOOGLE"
    )?.platformUserId

    if (!emailAddress && !googleEmailAddress) return

    setValue("contacts.0.contact", emailAddress ?? googleEmailAddress)
  }, [touchedFields.contacts, emails, platformUsers, providedEmail, setValue])

  return (
    <FormField
      control={control}
      name="contacts.0.contact"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your e-mail</FormLabel>
          <FormControl>
            <Input size="lg" {...field} />
          </FormControl>

          <FormErrorMessage />
        </FormItem>
      )}
    />
  )
}

export { EmailFormField }
