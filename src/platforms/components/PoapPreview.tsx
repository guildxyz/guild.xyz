import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import PlatformPreview from "./PlatformPreview"

const PoapPreview = (): JSX.Element => {
  const { poapData } = useCreatePoapContext()

  return (
    <PlatformPreview
      type="POAP"
      isValidating={!poapData}
      name={poapData?.name}
      image={poapData?.image_url ? `${poapData.image_url}?size=small` : undefined}
    />
  )
}

export default PoapPreview
