import { RequirementFormProps } from "requirements"
import SoundArtistSelect from "./SoundArtistSelect"
import SoundEdition from "./SoundEditionSelect"

const SoundArtistCollector = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <SoundArtistSelect baseFieldPath={baseFieldPath} />
    <SoundEdition baseFieldPath={baseFieldPath} />
  </>
)

export default SoundArtistCollector
