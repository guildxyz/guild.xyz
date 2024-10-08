import { Anchor } from "@/components/ui/Anchor"
import { Checkbox } from "@/components/ui/Checkbox"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form"
import { useFormContext } from "react-hook-form"
import { JoinForm } from "../types"

const ShareSocialsCheckbox = (): JSX.Element => {
  const { control } = useFormContext<JoinForm>()

  return (
    <FormField
      control={control}
      name="shareSocials"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="flex flex-row items-start gap-1">
          <FormControl>
            <Checkbox
              checked={value ?? false}
              onCheckedChange={onChange}
              {...field}
              className="size-3"
            />
          </FormControl>

          <FormLabel className="-top-1 relative text-muted-foreground text-sm">
            {`I agree to share my profile with the guild, so they can potentially
        reward me for my engagement in the community. `}
            <Anchor
              href="https://help.guild.xyz/en/articles/8489031-privacy-for-members"
              showExternal
              target="_blank"
              variant="muted"
            >
              Learn more
            </Anchor>
          </FormLabel>
        </FormItem>
      )}
    />
  )
}

export { ShareSocialsCheckbox }
