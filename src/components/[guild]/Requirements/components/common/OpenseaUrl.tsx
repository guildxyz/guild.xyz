import { HStack, Icon, Img, Link, Spinner, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"

type Props = {
  requirement: Requirement
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { data, isValidating } = useSWRImmutable(
    requirement.chain === "ETHEREUM"
      ? `/api/opensea-asset-data?address=${requirement?.address}`
      : null
  )

  if (!data && isValidating)
    return (
      <HStack>
        <Spinner size="xs" />
        <Text as="span" fontSize="xs" color="gray">
          Loading...
        </Text>
      </HStack>
    )

  if (!data && !isValidating) return <BlockExplorerUrl requirement={requirement} />

  return (
    <HStack>
      <Img src="/requirementLogos/opensea.svg" alt="View on Opensea" boxSize={3} />
      <Link
        href={`https://opensea.io/collection/${data?.slug}`}
        isExternal
        fontSize="xs"
        color="gray"
      >
        View on Opensea
        <Icon as={ArrowSquareOut} mx={1} />
      </Link>
    </HStack>
  )
}

export default OpenseaUrl
