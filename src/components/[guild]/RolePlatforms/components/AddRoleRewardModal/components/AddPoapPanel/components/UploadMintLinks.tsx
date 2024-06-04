import { FormControl, FormLabel, Stack, Text, Textarea } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { ImportPoapForm } from "../AddPoapPanel"
import UploadTxt from "./UploadTxt"

const LEGACY_POAP_MINT_LINK_BASE = "http://poap.xyz/claim/"
const POAP_MINT_LINK_BASE = "http://poap.xyz/mint/"

export const validatePoapLinks = (links: string[]) =>
  links
    .filter(Boolean)
    .map((link) => link.toLowerCase())
    .every(
      (link) =>
        (link.startsWith(LEGACY_POAP_MINT_LINK_BASE) ||
          link.startsWith(POAP_MINT_LINK_BASE)) &&
        /^[A-Za-z0-9]*$/i.test(
          link
            .replace(LEGACY_POAP_MINT_LINK_BASE, "")
            .replace(POAP_MINT_LINK_BASE, "")
        )
    )

export const INVALID_LINKS_ERROR = {
  type: "validate",
  message: "Your list includes invalid mint links!",
}

type Props = {
  isOptional?: boolean
}

const UploadMintLinks = ({ isOptional }: Props) => {
  const {
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<ImportPoapForm>()

  const texts = useWatch({ name: "texts" })

  return (
    <FormControl isInvalid={!!errors?.texts}>
      <FormLabel>
        <Text as="span">{"Mint links "}</Text>
        {isOptional && (
          <Text as="span" colorScheme="gray">
            (optional - you can upload them later)
          </Text>
        )}
      </FormLabel>

      <Stack>
        <UploadTxt />

        <Textarea
          value={texts?.join("\n")}
          onChange={(e) => {
            clearErrors()

            if (!e.target.value) {
              setValue("texts", [])
              return
            }

            const linksArray = e.target.value.split("\n")
            setValue("texts", linksArray)

            if (!validatePoapLinks(linksArray)) {
              setError("texts", INVALID_LINKS_ERROR)
            }
          }}
          minH={48}
          placeholder="... or paste links here, each one in a new line"
        />
        <FormErrorMessage>{errors?.texts?.message}</FormErrorMessage>
      </Stack>
    </FormControl>
  )
}
export default UploadMintLinks
