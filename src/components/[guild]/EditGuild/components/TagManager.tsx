import { HStack, Text } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useEffect } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { GuildFormType, GuildTags } from "types"

const TagManager = (): JSX.Element => {
  const { setValue: setTags, register: registerOuterForm } =
    useFormContext<GuildFormType>()
  const { register, watch } = useForm()

  useEffect(() => {
    registerOuterForm("tags")
  }, [registerOuterForm])

  useEffect(() => {
    const subscription = watch((data) => {
      const tags: GuildTags[] = Object.keys(data)
        .filter((key) => watch(key))
        .map((key) => key.toUpperCase() as GuildTags)

      setTags("tags", tags)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <>
      <Text colorScheme="gray" pb={4}>
        You can manage the guild tags here
      </Text>
      <HStack gap={7}>
        <Switch title="Featured" {...register("featured")} />
        <Switch title="Verified" {...register("verified")} />
      </HStack>
    </>
  )
}

export default TagManager
