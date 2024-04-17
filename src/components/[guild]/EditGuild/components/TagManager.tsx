import { HStack } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useEffect } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { GuildTags } from "types"

const TagManager = (): JSX.Element => {
  const { setValue, getValues } = useFormContext()
  const { register, watch } = useForm<{ [k in GuildTags]: boolean }>({
    defaultValues: {
      VERIFIED: getValues("tags").includes("VERIFIED"),
      FEATURED: getValues("tags").includes("FEATURED"),
    },
  })

  useEffect(() => {
    const subscription = watch((data) => {
      const newTags: GuildTags[] = Object.keys(data)
        .filter((key) => watch(key as GuildTags))
        .map((key) => key as GuildTags)

      setValue("tags", newTags, {
        shouldDirty: true,
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue])

  return (
    <HStack gap={7}>
      <Switch title="Featured" {...register("FEATURED")} />
      <Switch title="Verified" {...register("VERIFIED")} />
    </HStack>
  )
}

export default TagManager
