import { Skeleton } from "@chakra-ui/react"
import useMirrorEditions from "components/create-guild/Requirements/components/MirrorFormCard/hooks/useMirror"
import { useMemo } from "react"
import RequirementText from "./RequirementText"

const MirrorEdition = ({ id }) => {
  const { editions } = useMirrorEditions()

  const name = useMemo(
    () =>
      editions?.find?.((edition) => edition.editionId == id)?.title ??
      "[loading name...]",
    [editions]
  )

  return (
    <RequirementText>
      <>
        Own the{" "}
        <Skeleton isLoaded={editions} d="inline" as="span">
          {name}
        </Skeleton>{" "}
        Mirror edition
      </>
    </RequirementText>
  )
}

export default MirrorEdition
