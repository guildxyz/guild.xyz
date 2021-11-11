import { FormControl, Textarea } from "@chakra-ui/react"
import JSConfetti from "js-confetti"
import { useFormContext } from "react-hook-form"
import emojis from "temporaryData/emojiis"
const Description = (): JSX.Element => {
  const { register } = useFormContext()

  const throwSomething = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    const symbol = emojis.find((i) => i.keyword === val.toLowerCase())
    if (symbol) {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: [symbol.sign],
      })
    }
  }
  return (
    <FormControl>
      <Textarea
        {...register("description")}
        size="lg"
        onChange={(e) => throwSomething(e)}
        placeholder="Optional"
      />
    </FormControl>
  )
}

export default Description
