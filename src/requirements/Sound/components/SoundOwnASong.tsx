import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ArtistSelect from "./SoundArtistSelect"

const SoundOwnASong = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const handle = useWatch({ name: `${baseFieldPath}.data.id` })

  const [artistId, setArtistId] = useState("")

  const handleArtistId = (id: string) => {
    setArtistId(id)
  }

  const { data: songsData, isValidating: songsLoading } = useSWRImmutable(
    `/api/sound-songs?id=${artistId != undefined ? artistId : ""}`
  )

  const songOptions = songsData?.map((song) => ({
    label: song[0].title,
    value: song[0].title,
    img: song[0].image,
  }))

  return (
    <>
      <ArtistSelect
        handleArtistId={handleArtistId}
        baseFieldPathProp={baseFieldPath}
      />
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.title}
      >
        <FormLabel>Song title:</FormLabel>
        <Controller
          name={`${baseFieldPath}.data.title` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isDisabled={!handle}
              options={songOptions}
              placeholder="Pick a song"
              value={songOptions?.find((option) => option.value === value) ?? ""}
              onChange={(newSelectedOption: SelectOption) =>
                onChange(newSelectedOption?.value)
              }
              isLoading={songsLoading}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.title?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SoundOwnASong
