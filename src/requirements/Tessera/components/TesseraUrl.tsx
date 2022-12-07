import { RequirementLinkButton } from "requirements/common/RequirementButton"

type Props = {
  collectionSlug: string
}

const TesseraUrl = ({ collectionSlug }: Props): JSX.Element => {
  if (!collectionSlug) return null

  return (
    <RequirementLinkButton
      href={`https://tessera.co/collections/${collectionSlug}`}
      imageUrl="/explorerLogos/tessera.svg"
    >
      View on Tessera
    </RequirementLinkButton>
  )
}

export default TesseraUrl
