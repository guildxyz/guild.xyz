import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import SoundArtistSelect from "./SoundArtistSelect"

const SoundOwnASong = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
    resetField,
  } = useFormContext()

  const handle = useWatch({ name: `${baseFieldPath}.data.id` })

  const { data: artist, isValidating: artistLoading } = useSWRImmutable(
    handle ? `/api/sound/sound-artist-by-handle?soundHandle=${handle}` : null
  )

  const { data: songsData, isValidating: songsLoading } = useSWRImmutable(
    artist ? `/api/sound/sound-songs?id=${artist.id}` : null
  )

  const songOptions = songsData?.map((song) => ({
    label: song.title,
    value: song.title,
    img: song.image,
  }))

  return (
    <>
      <SoundArtistSelect
        baseFieldPath={baseFieldPath}
        field={field}
        onChange={() =>
          resetField(`${baseFieldPath}.data.title`, { defaultValue: "" })
        }
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
              isDisabled={!artist}
              options={songOptions}
              placeholder="Pick a song"
              value={songOptions?.find((option) => option.value === value) ?? ""}
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption?.value)
              }}
              isLoading={songsLoading || artistLoading}
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
