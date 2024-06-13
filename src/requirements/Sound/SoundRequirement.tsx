import { Link } from "@chakra-ui/next-js"
import { Img } from "@chakra-ui/react"
import Requirement, {
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
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
            if (artistData?.image) return <Img src={artistData?.image} />

          case "SOUND_COLLECTED":
            const songImage = songsData?.filter(
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              (song) => song.title == requirement.data.title
            )?.[0]?.image
            if (songImage) return <Img src={songImage} />

          default:
            return <Img src="/requirementLogos/sound.png" />
        }
      })()}
      {...props}
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
                  colorScheme="blue"
                >
                  Sound.xyz
                </Link>
              </>
            )
          case "SOUND_ARTIST_BACKED":
            return (
              <>
                {`Collect any ${
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  requirement.data.tierNumber === 1 ? "limited edition" : ""
                } song from `}
                <ArtistLink {...{ artistData, requirement }} />
                {` on Sound.xyz`}
              </>
            )
          case "SOUND_COLLECTED":
            return (
              <>
                {`Collect the `}
                <Link
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  href={`https://www.sound.xyz/${requirement.data.id}/${slugify(
                    // @ts-expect-error TODO: fix this error originating from strictNullChecks
                    requirement.data.title
                  )}`}
                  isExternal
                  fontWeight="medium"
                  colorScheme="blue"
                >
                  {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                  {requirement.data.title}
                </Link>
                {`${
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  requirement.data.tierNumber === 1 ? " limited edition" : ""
                } song from `}
                <ArtistLink {...{ artistData, requirement }} />
                {` on Sound.xyz`}
              </>
            )
          case "SOUND_TOP_COLLECTOR":
            return (
              <>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {`Be in the top ${requirement.data.topAmount} collectors of `}
                <ArtistLink {...{ artistData, requirement }} />
                {` on Sound.xyz`}
              </>
            )
          case "SOUND_NFTS":
            return (
              <>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {`Own at least ${requirement.data.minAmount}`}
                {` songs on `}
                <Link
                  href={`https://www.sound.xyz/`}
                  isExternal
                  fontWeight="medium"
                  colorScheme="blue"
                >
                  Sound.xyz
                </Link>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export const ArtistLink = ({ artistData, requirement }) => (
  <Link
    href={`https://www.sound.xyz/${requirement.data.id}`}
    isExternal
    fontWeight="medium"
    colorScheme="blue"
  >
    {artistData?.name ?? requirement.data.id}
  </Link>
)

export default SoundRequirement
