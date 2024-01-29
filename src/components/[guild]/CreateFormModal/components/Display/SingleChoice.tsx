import { Radio, Stack } from "@chakra-ui/react"
import { CreateFieldParams } from "../../schemas"

type Props = {
  field: CreateFieldParams
}

const SingleChoice = ({ field }: Props) => {
  // We probably won't run into this case, but needed to add this line to get valid intellisense
  if (field.type !== "SINGLE_CHOICE") return null

  const options = field.options.map((option) =>
    typeof option === "number" || typeof option === "string" ? option : option.value
  )

  return (
    <Stack spacing={1}>
      {options.map((option) => (
        <Radio key={option} value={option.toString()}>
          {option}
        </Radio>
      ))}
    </Stack>
  )
}
export default SingleChoice
