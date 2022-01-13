import { Box, FormControl, HStack, Input, Spinner } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useSWR from "swr"
import IconSelector from "./IconSelector"

const forbiddenNames = ["404", "guild", "hall", "halls", "role", "roles", "guide"]

const NameAndIcon = () => {
  const router = useRouter()
  const {
    register,
    trigger,
    formState: { errors, dirtyFields },
  } = useFormContext()

  const urlName = useWatch({ name: "urlName" })

  const swrTimeout = useRef(null)
  const [searchUrlName, setSearchUrlName] = useState(null)
  const { data: urlNameFound, isValidating } = useSWR(
    `/guild/urlName/${searchUrlName}`
  )

  useEffect(() => {
    if (swrTimeout.current) window.clearTimeout(swrTimeout.current)

    swrTimeout.current = setTimeout(() => setSearchUrlName(urlName), 500)
  }, [urlName])

  const isNameAvailable = useMemo(
    () => (router.pathname === "/create-guild" ? !urlNameFound : true),
    [router.pathname, urlNameFound]
  )

  useEffect(() => {
    if (!dirtyFields.name) return
    trigger("name")
  }, [isNameAvailable])

  return (
    <FormControl isRequired isInvalid={errors?.name}>
      <HStack spacing={2}>
        <IconSelector />
        <Box width="sm" position="relative">
          <Input
            size="lg"
            width="full"
            pr={10}
            {...register("name", {
              required: "This field is required.",
              maxLength: {
                value: 50,
                message: "The maximum possible name length is 50 characters",
              },
              validate: () =>
                (isNameAvailable && !forbiddenNames.includes(urlName)) ||
                "Please pick a different name.",
            })}
          />

          {isValidating && (
            <Spinner size="sm" position="absolute" top={4} right={4} />
          )}
        </Box>
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
