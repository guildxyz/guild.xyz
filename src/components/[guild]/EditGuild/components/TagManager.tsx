import { HStack } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { GuildTags } from "types"

type Props = {
  tags: GuildTags[]
  setTags: (tags: GuildTags[]) => void
}

const TagManager = ({ tags, setTags }: Props): JSX.Element => {
  const { register, watch } = useForm<{ [k in GuildTags]: boolean }>({
    defaultValues: {
      VERIFIED: tags.includes("VERIFIED"),
      FEATURED: tags.includes("FEATURED"),
    },
  })

  useEffect(() => {
    const subscription = watch((data) => {
      const newTags: GuildTags[] = Object.keys(data)
        .filter((key) => watch(key as GuildTags))
        .map((key) => key as GuildTags)

      setTags(newTags)
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
