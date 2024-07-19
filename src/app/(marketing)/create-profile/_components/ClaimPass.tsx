import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import {
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { GuildPassScene } from "./GuildPassScene"

const formSchema = z.object({
  inviteHandle: z.string(),
})

export const ClaimPass = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteHandle: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Card className="mx-auto max-w-lg bg-gradient-to-b from-card to-card-secondary p-8">
      <div className="mb-12 h-48 w-full">
        <GuildPassScene />
      </div>
      <h1 className="mb-14 text-pretty text-center font-extrabold text-2xl leading-none tracking-tighter">
        Claim your Guild Pass and begin an epic adventure!
      </h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="inviteHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite handle</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>Guild Pass is invite only</FormDescription>
                <FormErrorMessage />
              </FormItem>
            )}
          />
          <Button type="submit" colorScheme="success" className="w-full">
            Continue
            <ArrowRight weight="bold" />
          </Button>
        </form>
      </FormProvider>
    </Card>
  )
}
