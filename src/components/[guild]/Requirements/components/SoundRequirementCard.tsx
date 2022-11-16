import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import Link from "components/common/Link"
import {
  useSoundArtists,
  useSoundSongs,
} from "components/create-guild/Requirements/components/SoundFormCard/hooks/useSound"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SoundRequirementCard = ({ requirement, ...rest }: Props) => {
  const { artists, isLoading } = useSoundArtists(requirement.data.id)

  const songs = useSoundSongs(artists?.map((artist) => artist[0].id))

  const songImageUrl = songs?.songs
    ?.filter((title) => title[0].title == requirement.data.title)
    .map((song) => song[0].image)

  return (
    <RequirementCard
      image={(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST":
            return <Img src="/requirementLogos/sound.png" />

          case "SOUND_ARTIST_BACKED":
            return (
              <Img
                src={
                  artists?.map((artist) => artist[0].image) ??
                  "/requirementLogos/sound.png"
                }
              />
            )
          case "SOUND_COLLECTED":
            return <Img src={songImageUrl ?? "/requirementLogos/sound.png"} />
          case "SOUND_TOP_COLLECTOR":
            return (
              <Img
                src={
                  artists?.map((artist) => artist[0].image) ??
                  "/requirementLogos/sound.png"
                }
              />
            )
        }
      })()}
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST":
            return (
              <>
                {`Be an artist on `}
                <Link href={`https://www.sound.xyz/`} isExternal fontWeight="medium">
                  Sound.xyz
                </Link>
              </>
            )
          case "SOUND_ARTIST_BACKED":
            return (
              <>
                {`Support `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}`}
                  isExternal
                  fontWeight="medium"
                >
                  <DataBlock>{requirement.data.id}</DataBlock>
                </Link>
                {` on Sound.xyz`}
              </>
            )
          case "SOUND_COLLECTED":
            return (
              <>
                {`Own the `}
                <DataBlock>{requirement.data.title}</DataBlock>
                {` song from `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}`}
                  isExternal
                  fontWeight="medium"
                >
                  <DataBlock>{requirement.data.id}</DataBlock>
                </Link>
              </>
            )
          case "SOUND_TOP_COLLECTOR":
            return (
              <>
                {`Be in the top 10 collector of `}
                <DataBlock>{requirement.data.id}</DataBlock>
              </>
            )
        }
      })()}
    </RequirementCard>
  )
}

export default SoundRequirementCard
