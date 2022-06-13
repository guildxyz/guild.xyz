import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainInfo from "../ChainInfo"
import useGuildsPoaps from "./hooks/useGuildsPoaps"
import usePoapById from "./hooks/usePoapById"
import usePoaps from "./hooks/usePoaps"

type Props = {
  index: number
  field: Requirement
}

const FANCY_ID_REGEX = /^[0-9]*$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const PoapFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const type = useWatch({ name: `requirements.${index}.type` })

  const { poaps: guildsPoapsList } = useGuild()
  const { guildsPoaps, isGuildsPoapsLoading } = useGuildsPoaps(
    guildsPoapsList?.map((p) => p.fancyId)
  )

  const { isLoading: isPoapsLoading, poaps } = usePoaps()

  const [pastedId, setPastedId] = useState(null)
  const { isPoapByIdLoading, poap } = usePoapById(pastedId)

  const isLoading = useMemo(
    () => isGuildsPoapsLoading || isPoapsLoading || isPoapByIdLoading,
    [isGuildsPoapsLoading, isPoapsLoading, isPoapByIdLoading]
  )

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

    if (poap && !mappedGuildsPoaps?.find((p) => p.value === poap.fancy_id))
      poapsList.push({
        img: poap.image_url,
        label: poap.name,
        value: poap.fancy_id,
        details: `#${poap.id}`,
      })

    poapsList = poapsList.concat(
      poaps?.map((p) => ({
        img: p.image_url, // This will be displayed as an Img tag in the list
        label: p.name, // This will be displayed as the option text in the list
        value: p.fancy_id, // This is the actual value of this select
        details: `#${p.id}`,
      })) ?? []
    )

    if (poapsList?.length) {
      options = options.concat(poapsList)
    }

    return options
  }, [guildsPoaps, poaps, poap, isLoading])

  const dataId = useWatch({ name: `requirements.${index}.data.id`, control })
  const poapByFancyId = useMemo(
    () => poaps?.find((p) => p.fancy_id === dataId) || null,
    [poaps, dataId]
  )

  return (
    <>
      <ChainInfo>Works on both ETHEREUM and GNOSIS</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && !!errors?.requirements?.[index]?.data?.id}
      >
        <FormLabel>POAP:</FormLabel>
        <InputGroup>
          {dataId && poapByFancyId && (
            <InputLeftElement>
              <OptionImage
                img={poapByFancyId?.image_url}
                alt={poapByFancyId?.name}
              />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data?.id}
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
                defaultValue={mappedPoaps?.find((p) => p.value === field.data?.id)}
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
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default PoapFormCard
