import { FormHelperText } from "@chakra-ui/react"
import { Requirement } from "types"

const BeArtist = ({ index }: { index: number; field?: Requirement }) => (
  <>
    <FormHelperText>You don't have to input anything</FormHelperText>
  </>
)

export default BeArtist
