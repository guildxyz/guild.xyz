import { Anchor } from "@/components/ui/Anchor"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useSWRImmutable from "swr/immutable"
import slugify from "utils/slugify"

const SoundRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: artistData, isValidating: isArtistLoading } = useSWRImmutable(
    requirement.data?.id
      ? `/api/sound/sound-artist-by-handle?soundHandle=${requirement.data.id}`
      : null
  )

  const { data: songsData, isValidating: isSongsLoading } = useSWRImmutable(
    artistData && requirement.data.title
      ? `/api/sound/sound-songs?id=${artistData?.id}`
      : null
  )

  return (
    <Requirement
      isImageLoading={isArtistLoading || isSongsLoading}
      image={(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST_BACKED":
          case "SOUND_TOP_COLLECTOR":
            if (artistData?.image)
              return <img src={artistData?.image} alt={artistData.name} />

          case "SOUND_COLLECTED":
            const songImage = songsData?.filter(
              (song) => song.title == requirement.data.title
            )?.[0]?.image
            if (songImage)
              return <img src={songImage} alt={requirement.data.title} />

          default:
            return <img src="/requirementLogos/sound.png" alt="Sound requirement" />
        }
      })()}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST":
            return (
              <>
                <span>{"Be an artist on "}</span>
                <Anchor
                  href={`https://www.sound.xyz/`}
                  variant="highlighted"
                  showExternal
                  target="_blank"
                >
                  Sound.xyz
                </Anchor>
              </>
            )
          case "SOUND_ARTIST_BACKED":
            return (
              <>
                <span>{`Collect any ${
                  requirement.data.tierNumber === 1 ? "limited edition" : ""
                } song from `}</span>
                <ArtistLink {...{ artistData, requirement }} />
                <span>{" on Sound.xyz"}</span>
              </>
            )
          case "SOUND_COLLECTED":
            return (
              <>
                <span>{"Collect the "}</span>
                <Anchor
                  href={`https://www.sound.xyz/${requirement.data.id}/${slugify(
                    requirement.data.title
                  )}`}
                  variant="highlighted"
                  showExternal
                  target="_blank"
                >
                  {requirement.data.title}
                </Anchor>
                <span>{`${
                  requirement.data.tierNumber === 1 ? " limited edition" : ""
                } song from `}</span>
                <ArtistLink {...{ artistData, requirement }} />
                <span>{" on Sound.xyz"}</span>
              </>
            )
          case "SOUND_TOP_COLLECTOR":
            return (
              <>
                <span>{`Be in the top ${requirement.data.topAmount} collectors of `}</span>
                <ArtistLink {...{ artistData, requirement }} />
                <span>{" on Sound.xyz"}</span>
              </>
            )
          case "SOUND_NFTS":
            return (
              <>
                <span>{`Own at least ${requirement.data.minAmount} songs on `}</span>
                <Anchor
                  href="https://www.sound.xyz"
                  variant="highlighted"
                  showExternal
                  target="_blank"
                >
                  Sound.xyz
                </Anchor>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export const ArtistLink = ({ artistData, requirement }) => (
  <Anchor
    href={`https://www.sound.xyz/${requirement.data.id}`}
    variant="highlighted"
    showExternal
    target="_blank"
  >
    {artistData?.name ?? requirement.data.id}
  </Anchor>
)

export default SoundRequirement
