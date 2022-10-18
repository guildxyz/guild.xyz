import { Box, FormControl, Stack, Img, Button } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { Requirement } from "types"

type Props = {
  index: number
  field: Requirement
}

const options = [
  { label: "Before", value: "before" },
  { label: "After", value: "after" },
]

const VerisoulFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Box w="full">
        <Stack spacing="20" direction={"column"} w="full">
          <Img
            src={"https://welcome-ui-assets.s3.amazonaws.com/cheats.png"}
            alt={"noCheats"}
          />
          <Img
            src={"https://welcome-ui-assets.s3.amazonaws.com/bots.png"}
            alt={"noBots"}
          />
          <Img
            src={"https://welcome-ui-assets.s3.amazonaws.com/kyc.png"}
            alt={"noKyc"}
          />
          <FormControl>
            <Button>Learn more</Button>
          </FormControl>
        </Stack>
      </Box>
    </>
  )
}

export default VerisoulFormCard
