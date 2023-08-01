import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import { useState } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import { GuildTags } from "./../../../../types"

type Props = {
  defaultTags: GuildTags[]
  guildId: number
}

const useEditTags = ({ defaultTags = [], guildId }: Props) => {
  const showErrorToast = useShowErrorToast()
  const [tags, setTags] = useState<GuildTags[]>(defaultTags)
  const fetcher = useFetcherWithSign()

  const addTag = (tag: GuildTags) =>
    fetcher([
      `/FORCE_V2/guilds/${guildId}/tags`,
      {
        method: "POST",
        body: {
          tag,
        },
      },
    ])

  const deleteTag = (tag: GuildTags) =>
    fetcher([
      `/FORCE_V2/guilds/${guildId}/tags/${tag}`,
      {
        method: "DELETE",
        body: {},
      },
    ])

  const submit = async () => {
    const tagPromises = []

    defaultTags.forEach((defaultTag) => {
      if (!tags.includes(defaultTag)) {
        tagPromises.push(deleteTag(defaultTag))
      }
    })

    tags.forEach((tag) => {
      if (!defaultTags.includes(tag)) {
        tagPromises.push(addTag(tag))
      }
    })

    return Promise.all(tagPromises)
  }

  const useSubmitResponse = useSubmit(submit, {
    onError: (err) => showErrorToast(err),
  })

  return {
    tags,
    setTags,
    onSubmit: useSubmitResponse.onSubmit,
  }
}

export default useEditTags
