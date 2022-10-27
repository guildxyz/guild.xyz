import { Divider, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import Button from "components/common/Button"
import StyledSelect from "components/common/StyledSelect"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useIsConnected from "hooks/useIsConnected"
import { Lock } from "phosphor-react"
import { useEffect } from "react"
import { useController, useFormState } from "react-hook-form"
import { Requirement } from "types"
import SearchValue from "../TwitterFormCard/components/SearchValue"
import SpotifyFollowerCount from "./components/SpotifyFollowerCount"
import SpotifySearch from "./components/SpotifySearch"

type Props = {
  index: number
  field: Requirement
}

const spotifyRequirementTypes = [
  {
    label: "Follow an artist",
    value: "SPOTIFY_FOLLOW",
    Requirement: ({ index }: Props) => (
      <SpotifySearch index={index} type="artist" label="Artist to follow" />
    ),
  },
  {
    label: "Follow a playlist",
    value: "SPOTIFY_FOLLOW_PLAYLIST",
    Requirement: ({ index }: Props) => (
      <SpotifySearch index={index} type="playlist" label="Playlist to follow" />
    ),
  },
  {
    label: "Like an album",
    value: "SPOTIFY_SAVED_ALBUM",
    Requirement: ({ index }: Props) => (
      <SpotifySearch index={index} type="album" label="Album to like" />
    ),
  },
  {
    label: "Have an episode in library",
    value: "SPOTIFY_SAVED_EPISODE",
    Requirement: ({ index }: Props) => (
      <SpotifySearch
        index={index}
        type="episode"
        label="Episode to have in library"
      />
    ),
  },
  {
    label: "Follow a podcast",
    value: "SPOTIFY_SAVED_SHOW",
    Requirement: ({ index }: Props) => (
      <SpotifySearch index={index} type="show" label="Podcast to follow" />
    ),
  },
  {
    label: "Like a track",
    value: "SPOTIFY_SAVED_TRACK",
    Requirement: ({ index }: Props) => (
      <SpotifySearch index={index} type="track" label="Track to like" />
    ),
  },
  {
    label: "Minimum follower count",
    value: "SPOTIFY_FOLLOWER_COUNT",
    Requirement: SpotifyFollowerCount,
  },
  {
    label: "Spoitfy name includes text",
    value: "SPOTIFY_NAME",
    Requirement: SearchValue,
  },
]

const SpotifyFormCard = ({ index, field }: Props) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    defaultValue: "SPOTIFY_FOLLOW",
    name: `requirements.${index}.type`,
    rules: { required: "It's required to select a type" },
  })

  useEffect(() => {
    if (value === "SPOTIFY") onChange("SPOTIFY_FOLLOW")
  }, [value])

  const { errors } = useFormState()

  const selected = spotifyRequirementTypes.find((reqType) => reqType.value === value)

  const connectedPlatform = useIsConnected("SPOTIFY")

  const { onConnect, isLoading } = useConnectPlatform("SPOTIFY")

  if (!connectedPlatform) {
    return (
      <Button
        leftIcon={<Lock />}
        variant="outline"
        w="100%"
        mt={3}
        onClick={onConnect}
        isLoading={isLoading}
        loadingText="Authenticating"
      >
        Authenticate
      </Button>
    )
  }

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.type?.message}>
        <FormLabel>Type</FormLabel>
        <StyledSelect
          defaultValue={"SPOTIFY_FOLLOW"}
          options={spotifyRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.Requirement && (
        <>
          <Divider />
          <selected.Requirement index={index} field={field} />
        </>
      )}
    </>
  )
}

export default SpotifyFormCard
