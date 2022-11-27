import { RequirementFormProps } from "requirements"
import ArtistSelect from "./SoundArtistSelect"

const Top10Collector = ({ baseFieldPath }: RequirementFormProps) => (
  <>
    <ArtistSelect baseFieldPathProp={baseFieldPath} />
  </>
)

export default Top10Collector
