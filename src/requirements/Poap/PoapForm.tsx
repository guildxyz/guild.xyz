import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../common/ChainInfo"
import useGuildsPoaps from "./hooks/useGuildsPoaps"
import usePoapById from "./hooks/usePoapById"
import { usePoaps } from "./hooks/usePoaps"

const FANCY_ID_REGEX = /^[0-9]*$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const PoapForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const dataId = useWatch({ name: `${baseFieldPath}.data.id` })
  const { poap: poapDetails } = usePoap(dataId)

  const { poaps: guildsPoapsList } = useGuild()
  const { guildsPoaps, isGuildsPoapsLoading } = useGuildsPoaps(
    guildsPoapsList?.map((p) => p.fancyId)
  )

  const { isLoading: isPoapsLoading, poaps } = usePoaps()

  const [pastedId, setPastedId] = useState(null)
  const { isPoapByIdLoading, poap } = usePoapById(pastedId)

  const isLoading = isGuildsPoapsLoading || isPoapsLoading || isPoapByIdLoading

  const mappedPoaps = useMemo(() => {
    if (isLoading) return []

    let options = []

    const mappedGuildsPoaps =
      guildsPoaps?.map((p) => ({
        img: p.image_url,
        label: p.name,
        value: p.fancy_id,
        details: `#${p.id}`,
      })) ?? []

    if (mappedGuildsPoaps?.length) {
      options = options.concat(mappedGuildsPoaps)
    }

    let poapsList = []

    if (
      poapDetails &&
      !mappedGuildsPoaps?.find((p) => p.value === poapDetails.fancy_id)
    )
      poapsList.push({
        img: poapDetails.image_url,
        label: poapDetails.name,
        value: poapDetails.fancy_id,
        details: `#${poapDetails.id}`,
      })

    if (poap && !mappedGuildsPoaps?.find((p) => p.value === poap.fancy_id))
      poapsList.push({
        img: poap.image_url,
        label: poap.name,
        value: poap.fancy_id,
        details: `#${poap.id}`,
      })

    const guildsPoapsFancyIds = guildsPoaps?.map((p) => p.fancy_id) ?? []

    poapsList = poapsList.concat(
      poaps?.map((p) => {
        if (guildsPoapsFancyIds.includes(p.fancy_id)) return null
        return {
          img: p.image_url,
          label: p.name,
          value: p.fancy_id,
          details: `#${p.id}`,
        }
      }) ?? []
    )

    if (poapsList?.length) {
      options = options.concat(poapsList.filter((p) => !!p))
    }

    return options
  }, [guildsPoaps, poaps, poap, isLoading])

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on both ETHEREUM and GNOSIS</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && !!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>POAP:</FormLabel>
        <InputGroup>
          {poapDetails && (
            <InputLeftElement>
              <OptionImage img={poapDetails?.image_url} alt={poapDetails?.name} />
            </InputLeftElement>
          )}
          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{
              required: "This field is required.",
            }}
            isClearable
            isLoading={isLoading}
            options={mappedPoaps}
            placeholder="Search or paste ID"
            onInputChange={(text, _) => {
              const id = text?.replace("#", "")
              if (id?.length > 2 && FANCY_ID_REGEX.test(id)) setPastedId(id)
            }}
            filterOption={customFilterOption}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default PoapForm
