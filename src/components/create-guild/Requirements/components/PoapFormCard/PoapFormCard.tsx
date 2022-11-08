import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../ChainInfo"
import useGuildsPoaps from "./hooks/useGuildsPoaps"
import usePoapById from "./hooks/usePoapById"
import usePoaps from "./hooks/usePoaps"

const FANCY_ID_REGEX = /^[0-9]*$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const PoapFormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const dataId = useWatch({ name: `${baseFieldPath}.data.id`, control })
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
          <Controller
            name={`${baseFieldPath}.data.id` as const}
            control={control}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedPoaps}
                placeholder="Search..."
                value={mappedPoaps?.find((p) => p.value === selectValue)}
                onChange={(newValue: SelectOption) => onChange(newValue?.value)}
                onInputChange={(text, _) => {
                  const id = text?.replace("#", "")
                  if (id?.length > 2 && FANCY_ID_REGEX.test(id)) setPastedId(id)
                }}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormHelperText>Search by name or paste ID</FormHelperText>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default PoapFormCard
