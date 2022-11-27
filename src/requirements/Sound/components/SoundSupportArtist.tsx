import { RequirementFormProps } from "requirements"
import ArtistSelect from "./SoundArtistSelect"

const SupportArtist = ({ baseFieldPath }: RequirementFormProps) => (
  <>
    <ArtistSelect baseFieldPathProp={baseFieldPath} />
  </>
)

export default SupportArtist
