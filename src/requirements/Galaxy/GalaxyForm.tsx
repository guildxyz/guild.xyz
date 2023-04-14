import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import { useGalaxyCampaign, useGalaxyCampaigns } from "./hooks/useGalaxyCampaigns"

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.galaxyId?.includes(input)

const GalaxyForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`${baseFieldPath}.data.galaxyId`)
  }, [register])

  const selectedGalaxyId = useWatch({
    name: `${baseFieldPath}.data.galaxyId`,
  })

  const [searchText, setSearchText] = useState("")
  const debouncedSearchText = useDebouncedState(searchText)
  const { campaigns, isLoading } = useGalaxyCampaigns(debouncedSearchText)

  const [pastedId, setPastedId] = useState(field?.data?.galaxyId)
  const { campaign, isLoading: isCampaignLoading } = useGalaxyCampaign(
    selectedGalaxyId ??
      (!campaigns || campaigns?.find((c) => c.id === pastedId) ? null : pastedId)
  )

  const mappedCampaigns = useMemo(() => {
    if (campaign)
      return [
        {
          img: campaign.thumbnail,
          label: campaign.name,
          value: campaign.numberID?.toString(),
          galaxyId: campaign.id,
        },
      ]

    if (isLoading) return []

    let allCampaigns = []

    const publicCampaigns = campaigns?.map((c) => ({
      img: c.thumbnail,
      label: c.name,
      value: c.numberID?.toString(),
      galaxyId: c.id,
    }))

    if (publicCampaigns?.length) allCampaigns = allCampaigns.concat(publicCampaigns)

    return allCampaigns
  }, [campaigns, campaign])

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>Campaign:</FormLabel>

      <InputGroup>
        {campaign?.thumbnail && (
          <InputLeftElement>
            <OptionImage img={campaign.thumbnail} alt="Campaign thumbnail" />
          </InputLeftElement>
        )}

        <ControlledSelect
          name={`${baseFieldPath}.data.id`}
          rules={{
            required: "This field is required.",
          }}
          isClearable
          isLoading={isLoading || isCampaignLoading}
          options={mappedCampaigns}
          placeholder="Search campaigns..."
          afterOnChange={(newValue) =>
            setValue(`${baseFieldPath}.data.galaxyId`, newValue?.galaxyId)
          }
          onInputChange={(text, _) => {
            if (!text?.length) return
            const regex = /^[a-zA-Z0-9]+$/i
            if (regex.test(text)) {
              setPastedId(text)
            }
            setSearchText(text)
          }}
          filterOption={customFilterOption}
          noResultText={!debouncedSearchText.length ? "Start typing..." : undefined}
        />
      </InputGroup>

      <FormHelperText>Search by name or ID</FormHelperText>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default GalaxyForm
