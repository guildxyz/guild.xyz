import { Img } from "@chakra-ui/react"
import Link from "components/common/Link"
import slugify from "slugify"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SoundRequirementCard = ({ requirement, ...rest }: Props) => {
  const { data: artistsData, isValidating: artistsLoading } = useSWRImmutable(
    `/api/sound-artists?searchQuery=${requirement.data?.id}`
  )

  const { data: songsData, isValidating: songsLoading } = useSWRImmutable(
    `/api/sound-songs?id=${artistsData?.map((artist) => artist[0].id)}`
  )

  const songImageUrl = songsData
    ?.filter((title) => title[0].title == requirement.data.title)
    .map((song) => song[0].image)

  return (
    <RequirementCard
      image={(() => {
        switch (requirement.type) {
          case "SOUND_ARTIST":
            return <Img src="/requirementLogos/sound.png" />

          case "SOUND_ARTIST_BACKED":
            return artistsData?.map((artist) => artist[0].image) ? (
              <Img src={artistsData?.map((artist) => artist[0].image)} />
            ) : (
              <Img src="/requirementLogos/sound.png" />
            )

          case "SOUND_COLLECTED":
            return songsData?.map((song) => song[0].image) ? (
              <Img src={songImageUrl} />
            ) : (
              <Img src="/requirementLogos/sound.png" />
            )
          case "SOUND_TOP_COLLECTOR":
            return artistsData?.map((artist) => artist[0].image) ? (
              <Img src={artistsData?.map((artist) => artist[0].image)} />
            ) : (
              <Img src="/requirementLogos/sound.png" />
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
                <Link
                  href={`https://www.sound.xyz/`}
                  isExternal
                  colorScheme={"blue"}
                  fontWeight="medium"
                >
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
                  colorScheme={"blue"}
                >
                  {requirement.data.id}
                </Link>
                {` on `}
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
                {` on `}
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
                {` on `}
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
        }
      })()}
    </RequirementCard>
  )
}

export default SoundRequirementCard
