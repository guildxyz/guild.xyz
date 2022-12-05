import { Img } from "@chakra-ui/react"
import Link from "components/common/Link"
import { RequirementComponentProps } from "requirements"
import Requirement from "requirements/common/Requirement"
import useSWRImmutable from "swr/immutable"
import slugify from "utils/slugify"

const SoundRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data: artistData } = useSWRImmutable(
    requirement.data?.id
      ? `/api/sound/sound-artist-by-handle?soundHandle=${requirement.data.id}`
      : null
  )

  const { data: songsData, isValidating: songsLoading } = useSWRImmutable(
    artistData && requirement.data.title
      ? `/api/sound/sound-songs?id=${artistData?.id}`
      : null
  )

  return (
    <Requirement
      loading={songsLoading}
      image={(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST_BACKED":
          case "SOUND_TOP_COLLECTOR":
            if (artistData?.image) return <Img src={artistData?.image} />

          case "SOUND_COLLECTED":
            const songImage = songsData?.filter(
              (song) => song.title == requirement.data.title
            )?.[0]?.image
            if (songImage) return <Img src={songImage} />

          default:
            return <Img src="/requirementLogos/sound.png" />
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
                <Link
                  href={`https://www.sound.xyz/`}
                  isExternal
                  fontWeight="medium"
                  colorScheme={"blue"}
                >
                  Sound.xyz
                </Link>
              </>
            )
          case "SOUND_ARTIST_BACKED":
            return (
              <>
                {`Support `}
                <ArtistLink {...{ artistData, requirement }} />
                {` on Sound.xyz`}
              </>
            )
          case "SOUND_COLLECTED":
            return (
              <>
                {`Own the `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}/${slugify(
                    requirement.data.title
                  )}`}
                  isExternal
                  fontWeight="medium"
                  colorScheme={"blue"}
                >
                  {requirement.data.title}
                </Link>
                {` song from `}
                <ArtistLink {...{ artistData, requirement }} />
                {` on Sound.xyz`}
              </>
            )
          case "SOUND_TOP_COLLECTOR":
            return (
              <>
                {`Be in the top 10 collectors of `}
                <ArtistLink {...{ artistData, requirement }} />
                {` on Sound.xyz`}
              </>
            )
        }
      })()}
    </Requirement>
  )
}

const ArtistLink = ({ artistData, requirement }) => (
  <Link
    href={`https://www.sound.xyz/${requirement.data.id}`}
    isExternal
    fontWeight="medium"
    colorScheme={"blue"}
  >
    {artistData?.name ?? requirement.data.id}
  </Link>
)

export default SoundRequirement
