import {
  Circle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Img,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import useGateables from "hooks/useGateables"
import { useEffect, useState } from "react"
import {
  useController,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"

type Props = {
  index: number
  type: "album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook"
  label: string
}

const LINK_REGEX =
  /^(?:https\:\/\/)?(?:www\.)?open\.spotify\.com\/([a-z]*)\/(.*?)(?:\?.*)?$/

const SpotifySearch = ({ index, type, label }: Props) => {
  const { setValue } = useFormContext()

  const requirementLabel = useWatch({
    name: `requirements.${index}.data.params.label`,
  })
  const { errors } = useFormState()

  const [searchValue, setSearchValue] = useState<string>("")
  useEffect(() => setSearchValue(requirementLabel), [])
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { isValidating, gateables } = useGateables(
    "SPOTIFY",
    undefined,
    {
      q: debouncedSearchValue,
      type,
    },
    typeof debouncedSearchValue === "string" && debouncedSearchValue.length > 0
  )
  const options = gateables ?? []

  const [selectValue, setSelectValue] = useState<string>()

  const selectedOption = options.find((option) => option.value === selectValue)

  const reqParams = useWatch({ name: `requirements.${index}.data.params` })
  const reqId = useWatch({ name: `requirements.${index}.data.id` })

  const setRequirementFieldsFromOption = (option: {
    value: string
    label: string
    img?: string
    details?: string
  }) => {
    setValue(`requirements.${index}.data.id`, option?.value)
    setValue(`requirements.${index}.data.params.label`, option?.label)
    setValue(`requirements.${index}.data.params.img`, option?.img)
    if (option?.details) {
      setValue(`requirements.${index}.data.params.artist`, option?.details)
    }
  }

  const linkInputForm = useForm({ mode: "all", defaultValues: { linkInput: "" } })
  const { field } = useController({
    control: linkInputForm.control,
    name: "linkInput",
    defaultValue: "",
    rules: {
      required: "Thid field is required",
    },
  })

  const debouncedLinkInputValue = useDebouncedState(field.value)

  const { gateables: linkItem } = useGateables(
    "SPOTIFY",
    undefined,
    {
      id: debouncedLinkInputValue,
      type,
    },
    typeof debouncedLinkInputValue === "string" && debouncedLinkInputValue.length > 0
  )

  useEffect(() => {
    if (!linkItem) {
      return
    }

    const item = linkItem as any as {
      value: string
      label: string
      img?: string
      details?: string
    }

    setRequirementFieldsFromOption(item)
  }, [linkItem])

  useEffect(() => {
    if (!selectedOption) {
      return
    }
    setRequirementFieldsFromOption(selectedOption)
  }, [selectedOption])

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.id?.message}>
        <FormLabel>Search for a(n) {type}</FormLabel>

        <StyledSelect
          value={selectedOption}
          onChange={(selected) => {
            setSelectValue(selected?.value)
          }}
          filterOption={() => true}
          options={options}
          isLoading={isValidating}
          onInputChange={(val, { action }) => {
            if (action !== "input-blur" && action !== "menu-close") {
              setSearchValue(val)
            }
          }}
          inputValue={searchValue}
          placeholder="Search..."
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!linkInputForm.formState.errors.linkInput?.message}>
        <FormLabel>Or paste an id / link</FormLabel>

        <Input
          placeholder={"https://open.spotify.com/..."}
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          value={field.value}
          onChange={(event) => {
            const linkOrId = event.target.value

            if (LINK_REGEX.test(linkOrId)) {
              const match = linkOrId.match(LINK_REGEX)
              if (match?.[1] !== type) {
                linkInputForm.setError("linkInput", {
                  message: `Not a(n) ${type} id`,
                })
              }
              linkInputForm.setValue(
                "linkInput",
                linkOrId.match(LINK_REGEX)?.[2] ?? ""
              )
            } else {
              field.onChange(linkOrId)
            }
          }}
        />

        <FormErrorMessage>
          {linkInputForm.formState.errors.linkInput?.message}
        </FormErrorMessage>
      </FormControl>

      {reqParams?.label && (
        <>
          <FormLabel>Selected</FormLabel>
          <HStack>
            {reqParams?.img && (
              <Circle overflow="hidden">
                <Img src={reqParams?.img} width={10} height={10}></Img>
              </Circle>
            )}
            <VStack alignItems={"start"} spacing={0}>
              <Link isExternal href={`https://open.spotify.com/${type}/${reqId}`}>
                {reqParams?.label}
              </Link>
              {reqParams?.artist && (
                <Text color={"gray.500"} fontSize="sm">
                  {reqParams?.artist}
                </Text>
              )}
            </VStack>
          </HStack>
        </>
      )}
    </>
  )
}

export default SpotifySearch
