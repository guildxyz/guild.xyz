import {
  chakra,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { Question } from "phosphor-react"
import { useController } from "react-hook-form"
import { Requirement } from "types"
import MinMaxAmount from "../../MinMaxAmount"
import SpotifySearch from "./SpotifySearch"

type Props = {
  requirement: Requirement
  index: number
  label: string
  type: "track" | "artist"
}

const termOptions = [
  { value: "short", label: "Short term" },
  { value: "medium", label: "Medium term" },
  { value: "long", label: "Long term" },
]

const SpotifyTop = ({ requirement, index, label, type }: Props) => {
  const { field } = useController({
    name: `requirements.${index}.data.params.term`,
    defaultValue: "short",
  })

  const selectedOption = termOptions.find((option) => option.value === field.value)

  return (
    <>
      <SpotifySearch index={index} label={label} type={type} />
      <MinMaxAmount
        hideSetMaxButton
        field={requirement}
        index={index}
        format="INT"
      />

      <FormControl>
        <HStack spacing={1} mb={2} align={"center"}>
          <FormLabel mb={0}>Term</FormLabel>

          <Popover placement="top" trigger="hover">
            <PopoverTrigger>
              <Question />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Text>
                  <chakra.span fontWeight={"bold"}>Long term</chakra.span> is
                  calculated from several years of data and including all new data as
                  it becomes available.
                </Text>

                <Divider my={3} />

                <Text>
                  <chakra.span fontWeight={"bold"}>Medium term</chakra.span> is
                  calculated from approximately last 6 months of data.
                </Text>

                <Divider my={3} />

                <Text>
                  <chakra.span fontWeight={"bold"}>Short term</chakra.span> is
                  calculated from approximately the last 4 weeks of data.
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>

        <StyledSelect
          options={termOptions}
          value={selectedOption}
          onChange={(selected) => field.onChange(selected.value)}
          onBlur={field.onBlur}
          ref={field.ref}
          name={field.name}
        />
      </FormControl>
    </>
  )
}

export default SpotifyTop
