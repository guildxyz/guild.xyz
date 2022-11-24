import { FormControl, FormHelperText } from "@chakra-ui/react"
import { RequirementFormProps } from "requirements"

const BeArtist = ({ baseFieldPath }: RequirementFormProps) => (
  <>
    <FormControl>
      <FormHelperText>You don't have to input anything</FormHelperText>
    </FormControl>
  </>
)

export default BeArtist
