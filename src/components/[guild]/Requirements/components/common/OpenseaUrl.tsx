import { Img } from "@chakra-ui/react"
import Button from "components/common/Button"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"

type Props = {
  requirement: Requirement
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { data, isValidating } = useSWRImmutable(
    `/api/opensea-asset-data/${requirement?.address}`
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
