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
import useGalaxyCampaign from "components/[guild]/Requirements/components/GalaxyRequirementCard/hooks/useGalaxyCampaign"
import { Chain } from "connectors"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainPicker from "../ChainPicker"
import useGalaxyCampaigns from "./hooks/useGalaxyCampaigns"

type Props = {
  index: number
  field: Requirement
}

const convertToSupportedChain = (chain: string): Chain => {
  if (chain === "MATIC") return "POLYGON"
  return chain as Chain
}

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.galaxyId?.includes(input)

const GalaxyFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  useEffect(() => {
    if (!register) return
    register(`requirements.${index}.chain`)
    register(`requirements.${index}.data.galaxyId`)
  }, [register])

  const selectedId = useWatch({ control, name: `requirements.${index}.data.id` })

  const { campaigns, isLoading } = useGalaxyCampaigns()

  const [pastedId, setPastedId] = useState(field.data?.galaxyId)
  const { campaign, isLoading: isCampaignLoading } = useGalaxyCampaign(
    !campaigns || campaigns?.find((c) => c.id === pastedId) ? null : pastedId
  )

  const mappedCampaigns = useMemo(() => {
    if (isLoading || isCampaignLoading) return []

    let allCampaigns = []

    if (campaign)
      allCampaigns.push({
        img: campaign.thumbnail,
        label: campaign.name,
        value: campaign.numberID?.toString(),
        chain: campaign.chain,
        galaxyId: campaign.id,
      })

    const publicCampaigns = campaigns?.map((c) => ({
      img: c.thumbnail,
      label: c.name,
      value: c.numberID?.toString(),
      chain: c.chain,
      galaxyId: c.id,
    }))

    if (publicCampaigns?.length) allCampaigns = allCampaigns.concat(publicCampaigns)

    return allCampaigns
  }, [campaigns, campaign])

  const [campaignImage, setCampaignImage] = useState(null)

  useEffect(() => {
    if (!campaigns?.length) return
    if (!selectedId) {
      setCampaignImage(null)
      return
    }

    const selectedCampaign = campaigns.find(
      (c) => c.numberID?.toString() === selectedId
    )

    const isPrivateCampaign = selectedId === campaign?.numberID?.toString()

    setValue(
      `requirements.${index}.chain`,
      convertToSupportedChain(
        isPrivateCampaign ? campaign.chain : selectedCampaign?.chain
      )
    )

    const thumbnail = isPrivateCampaign
      ? campaign.thumbnail
      : selectedCampaign?.thumbnail
    setCampaignImage(thumbnail)
  }, [campaigns, selectedId])

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.data?.id) return
    setValue(`requirements.${index}.data.id`, null)
    clearErrors(`requirements.${index}.data.id`)
  }

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        supportedChains={[
          "ETHEREUM",
          "BSC",
          "POLYGON",
          "FANTOM",
          "ARBITRUM",
          "AVALANCHE",
        ]}
        defaultChain={field.chain}
        onChange={resetForm}
        isDisabled
      />

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.data?.id}>
        <FormLabel>Campaign:</FormLabel>

        <InputGroup>
          {campaignImage && (
            <InputLeftElement>
              <OptionImage img={campaignImage} alt="Campaign thumbnail" />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data?.id}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading || isCampaignLoading}
                options={mappedCampaigns}
                placeholder="Search campaigns..."
                value={mappedCampaigns?.find((c) => c.value === value) || null}
                defaultValue={mappedCampaigns?.find(
                  (c) => c.value === field.data?.id
                )}
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption?.value)
                  setValue(
                    `requirements.${index}.data.galaxyId`,
                    selectedOption?.galaxyId
                  )
                }}
                onInputChange={(text, _) => {
                  if (!text?.length) return
                  const regex = /^[a-zA-Z0-9]+$/i
                  if (regex.test(text)) setPastedId(text)
                }}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormHelperText>Search by name or ID</FormHelperText>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GalaxyFormCard
