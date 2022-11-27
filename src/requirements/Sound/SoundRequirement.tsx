import { Img } from "@chakra-ui/react"
import Link from "components/common/Link"
import { RequirementComponentProps } from "requirements"
import Requirement from "requirements/common/Requirement"
import slugify from "slugify"
import useSWRImmutable from "swr/immutable"

const SoundRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data: artistsData, isValidating: artistsLoading } = useSWRImmutable(
    requirement.data?.id
      ? `/api/sound-artists?searchQuery=${requirement.data.id}`
      : null
  )

  const { data: songsData, isValidating: songsLoading } = useSWRImmutable(
    artistsData ? `/api/sound-songs?id=${artistsData[0]?.id}` : null
  )

  const songImageUrl = songsData
    ?.filter((song) => song.title == requirement.data.title)
    .map((song) => song.image)

  return (
    <Requirement
      image={(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST":
            return <Img src="/requirementLogos/sound.png" />

          case "SOUND_ARTIST_BACKED":
          case "SOUND_TOP_COLLECTOR":
            if (artistsData?.map((artist) => artist.image))
              return <Img src={artistsData?.map((artist) => artist.image)} />

          case "SOUND_COLLECTED":
            if (songsData?.map((song) => song.image))
              return <Img src={songImageUrl} />
          default:
            return <Img src="/requirementLogos/sound.png" />
        }
      })()}
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST":
            return <>{`Be an artist`}</>
          case "SOUND_ARTIST_BACKED":
            return (
              <>
                {`Support `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}`}
                  isExternal
                  fontWeight="medium"
                  colorScheme={"blue"}
                >
                  {requirement.data.id}
                </Link>
              </>
            )
          case "SOUND_COLLECTED":
            return (
              <>
                {`Own the `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}/${slugify(
                    requirement.data.title,
                    {
                      lower: true,
                      strict: true,
                    }
                  )}`}
                  isExternal
                  fontWeight="medium"
                  colorScheme={"blue"}
                >
                  {requirement.data.title}
                </Link>
                {` song from `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}`}
                  isExternal
                  fontWeight="medium"
                  colorScheme={"blue"}
                >
                  {requirement.data.id}
                </Link>
              </>
            )
          case "SOUND_TOP_COLLECTOR":
            return (
              <>
                {`Be in the top 10 collector of `}
                <Link
                  href={`https://www.sound.xyz/${requirement.data.id}`}
                  isExternal
                  fontWeight="medium"
                  colorScheme={"blue"}
                >
                  {requirement.data.id}
                </Link>
              </>
            )
        }
      })()}
      {` on `}
      <Link
        href={`https://www.sound.xyz/`}
        isExternal
        fontWeight="medium"
        colorScheme={"blue"}
      >
        Sound.xyz
      </Link>
    </Requirement>
  )
}

export default SoundRequirement
