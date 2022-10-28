import { FormControl, FormLabel } from "@chakra-ui/react"
import { Requirement } from "types"
import MinMaxAmount from "../../MinMaxAmount"
import SpotifySearch from "./SpotifySearch"

type Props = {
  requirement: Requirement
  index: number
  label: string
  type: "track" | "artist"
}

const SpotifyTop = ({ requirement, index, label, type }: Props) => (
  <>
    <SpotifySearch index={index} label={label} type={type} />
    <FormControl>
      <FormLabel>Top</FormLabel>
      <MinMaxAmount
        hideSetMaxButton
        field={requirement}
        index={index}
        format="INT"
      />
    </FormControl>
  </>
)

export default SpotifyTop
