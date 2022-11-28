import { RequirementFormProps } from "requirements"
import ArtistSelect from "./SoundArtistSelect"

const SoundTop10Collector = ({ baseFieldPath }: RequirementFormProps) => (
  <>
    <ArtistSelect baseFieldPath={baseFieldPath} />
  </>
)

export default SoundTop10Collector
