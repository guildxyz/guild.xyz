import useGuild from "components/[guild]/hooks/useGuild"
import useIsV2 from "hooks/useIsV2"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import { useFetcherWithSign } from "utils/fetcher"
import { GuildTags } from "./../../../../types"

const useEditTags = (currentTags: GuildTags[]) => {
  const { tags: defaultTags, id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcher = useFetcherWithSign()
  const isV2 = useIsV2()

  const addTag = isV2
    ? (tag: GuildTags) =>
        fetcher([
          `/v2/guilds/${guildId}/tags`,
          {
            method: "POST",
            body: {
              tag,
            },
          },
        ])
    : () => {}

  const deleteTag = isV2
    ? (tag: GuildTags) =>
        fetcher([
          `/v2/guilds/${guildId}/tags/${tag}`,
          {
            method: "DELETE",
            body: {},
          },
        ])
    : () => {}

  const submit = async () => {
    const tagPromises = []

    defaultTags.forEach((defaultTag) => {
      if (!currentTags.includes(defaultTag)) {
        tagPromises.push(deleteTag(defaultTag))
      }
    })

    currentTags.forEach((tag) => {
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
    onSubmit: useSubmitResponse.onSubmit,
  }
}

export default useEditTags
