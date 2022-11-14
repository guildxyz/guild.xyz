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
import useGalaxyCampaign from "components/[guild]/Requirements/components/GalaxyRequirement/hooks/useGalaxyCampaign"
import { Chain } from "connectors"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../ChainPicker"
import useGalaxyCampaigns from "./hooks/useGalaxyCampaigns"

const convertToSupportedChain = (chain: string): Chain => {
  if (chain === "MATIC") return "POLYGON"
  return chain as Chain
}

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.galaxyId?.includes(input)

const GalaxyFormCard = ({ baseFieldPath, field }: FormCardProps): JSX.Element => {
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`${baseFieldPath}.chain`)
    register(`${baseFieldPath}.data.galaxyId`)
  }, [register])

  const selectedId = useWatch({ control, name: `${baseFieldPath}.data.id` })

  const { campaigns, isLoading } = useGalaxyCampaigns()

  const [pastedId, setPastedId] = useState(field?.data?.galaxyId)
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
      `${baseFieldPath}.chain`,
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
    if (!parseFromObject(touchedFields, baseFieldPath)?.data?.id) return
    setValue(`${baseFieldPath}.data.id`, null)
    clearErrors(`${baseFieldPath}.data.id`)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={[
          "ETHEREUM",
          "BSC",
          "POLYGON",
          "FANTOM",
          "ARBITRUM",
          "AVALANCHE",
        ]}
        onChange={resetForm}
        isDisabled
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Campaign:</FormLabel>

        <InputGroup>
          {campaignImage && (
            <InputLeftElement>
              <OptionImage img={campaignImage} alt="Campaign thumbnail" />
            </InputLeftElement>
          )}
          <Controller
            name={`${baseFieldPath}.data.id` as const}
            control={control}
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
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption?.value)
                  setValue(
                    `${baseFieldPath}.data.galaxyId`,
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
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default GalaxyFormCard
