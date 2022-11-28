import { RequirementFormProps } from "requirements"
import ArtistSelect from "./SoundArtistSelect"

const SoundSupportArtist = ({ baseFieldPath }: RequirementFormProps) => (
  <>
    <ArtistSelect baseFieldPath={baseFieldPath} />
  </>
)

export default SoundSupportArtist
