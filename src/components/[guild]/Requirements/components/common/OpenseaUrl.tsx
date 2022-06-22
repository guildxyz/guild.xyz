import { Img, Spinner } from "@chakra-ui/react"
import Button from "components/common/Button"
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
      <Button
        size="xs"
        borderRadius="lg"
        variant="ghost"
        leftIcon={<Spinner size="xs" />}
      >
        Loading...
      </Button>
    )

  if (!data && !isValidating) return <BlockExplorerUrl requirement={requirement} />

  return (
    <Button
      as="a"
      href={`https://opensea.io/collection/${data?.slug}`}
      target="_blank"
      size="xs"
      borderRadius="lg"
      variant="ghost"
      leftIcon={
        <Img src="/requirementLogos/opensea.svg" alt="View on Opensea" boxSize={4} />
      }
    >
      View on Opensea
    </Button>
  )
}

export default OpenseaUrl
