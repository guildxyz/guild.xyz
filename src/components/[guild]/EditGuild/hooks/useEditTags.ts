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

    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    defaultTags.forEach((tag) => {
      if (!tags.includes(tag)) {
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        tagPromises.push(deleteTag(tag))
      }
    })

    tags.forEach((tag) => {
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      if (!defaultTags.includes(tag)) {
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
