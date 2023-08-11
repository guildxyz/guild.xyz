import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import { useFetcherWithSign } from "utils/fetcher"
import { GuildTags } from "./../../../../types"

const useEditTags = () => {
  const { tags: defaultTags, id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const addTag = (tag: GuildTags) =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/tags`,
      {
        method: "POST",
        body: {
          tag,
        },
      },
    ])

  const deleteTag = (tag: GuildTags) =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/tags/${tag}`,
      {
        method: "DELETE",
        body: {},
      },
    ])

  const submit = async (tags: GuildTags[]) => {
    const tagPromises = []

    defaultTags.forEach((tag) => {
      if (!tags.includes(tag)) {
        tagPromises.push(deleteTag(tag))
      }
    })

    tags.forEach((tag) => {
      if (!defaultTags.includes(tag)) {
        tagPromises.push(addTag(tag))
      }
    })

    return Promise.all(tagPromises)
  }

  return useSubmit(submit, {
    onError: (err) => showErrorToast(err),
  })
}

export default useEditTags
