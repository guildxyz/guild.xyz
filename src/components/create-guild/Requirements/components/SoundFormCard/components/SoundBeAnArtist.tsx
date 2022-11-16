import { FormControl, FormHelperText } from "@chakra-ui/react"
import { FormCardProps } from "types"

const BeArtist = ({ baseFieldPath }: FormCardProps) => (
  <>
    <FormControl>
      <FormHelperText>You don't have to input anything</FormHelperText>
    </FormControl>
  </>
)

export default BeArtist
