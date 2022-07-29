import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption, SupportedChains } from "types"
import ChainPicker from "../ChainPicker"
import useGalaxyCampaigns from "./hooks/useGalaxyCampaigns"

type Props = {
  index: number
  field: Requirement
}

const convertToSupportedChain = (chain: string): SupportedChains => {
  if (chain === "MATIC") return "POLYGON"
  return chain as SupportedChains
}

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

  const mappedCampaigns = useMemo(
    () =>
      campaigns?.map((campaign) => ({
        img: campaign.thumbnail,
        label: campaign.name,
        value: campaign.numberID?.toString(),
        chain: campaign.chain,
        galaxyId: campaign.id,
      })),
    [campaigns]
  )

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

    setValue(
      `requirements.${index}.chain`,
      convertToSupportedChain(selectedCampaign?.chain)
    )

    const thumbnail = selectedCampaign?.thumbnail
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
                isLoading={isLoading}
                options={mappedCampaigns}
                placeholder="Search campaigns..."
                value={
                  mappedCampaigns?.find((campaign) => campaign.value === value) ||
                  null
                }
                defaultValue={mappedCampaigns?.find(
                  (campaign) => campaign.value === field.data?.id
                )}
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption?.value)
                  setValue(
                    `requirements.${index}.data.galaxyId`,
                    selectedOption?.galaxyId
                  )
                }}
                onBlur={onBlur}
              />
            )}
          />
        </InputGroup>
      </FormControl>
    </>
  )
}

export default GalaxyFormCard
