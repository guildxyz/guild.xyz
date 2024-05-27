import { HStack, Text } from "@chakra-ui/react"
import { ProvidedValueDisplayProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import { ArtistLink } from "../SoundRequirement"

const TopCollectorProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const { data: artistData } = useSWRImmutable(
    requirement.data?.id
      ? `/api/sound/sound-artist-by-handle?soundHandle=${requirement.data.id}`
      : null
  )

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>
        Rank on collectors' toplist for{" "}
        <ArtistLink {...{ artistData, requirement }} />
      </Text>{" "}
    </HStack>
  )
}

export default TopCollectorProvidedValue
