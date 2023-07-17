import { HStack } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useEffect } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { GuildFormType, GuildTags } from "types"

const TagManager = (): JSX.Element => {
  const {
    setValue: setTags,
    register: registerOuterForm,
    getValues: getSavedData,
  } = useFormContext<GuildFormType>()
  const { register, watch } = useForm<{ [k in GuildTags]: boolean }>({
    defaultValues: {
      VERIFIED: getSavedData().tags.includes("VERIFIED"),
      FEATURED: getSavedData().tags.includes("FEATURED"),
    },
  })

  useEffect(() => {
    registerOuterForm("tags")
  }, [registerOuterForm])

  useEffect(() => {
    const subscription = watch((data) => {
      const tags: GuildTags[] = Object.keys(data)
        .filter((key) => watch(key as GuildTags))
        .map((key) => key as GuildTags)

      setTags("tags", tags)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <HStack gap={7}>
      <Switch title="Featured" {...register("FEATURED")} />
      <Switch title="Verified" {...register("VERIFIED")} />
    </HStack>
  )
}

export default TagManager
