import { Button, FormControl, FormLabel, Input, SimpleGrid } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

const TelegramGroup = () => {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const platformId = useWatch({ name: "platformId" })

  const {
    data: { ok: isIn, message: errorMessage },
    isLoading,
  } = useIsTGBotIn(platformId)

  // Doing it "manually" because we can't re-register the "platformId" field!
  useEffect(() => {
    if (!platformId?.length)
      setError("platformId", { type: "required", message: "This field is required" })
    else if (platformId.length < 9)
      setError("platformId", {
        type: "validate",
        message: "PlatformId must be at least 9 characters long",
      })
    else if (!isIn && errorMessage)
      setError("platformId", { type: "validate", message: errorMessage })
    else clearErrors("platformId")
  }, [platformId, isIn, errorMessage])

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing="4"
        px="5"
        py="4"
        w="full"
      >
        <FormControl>
          <FormLabel>1. Add bot</FormLabel>
          {!isIn ? (
            <Button
              h="10"
              w="full"
              as="a"
              href="https://t.me/guildxyz_bot?startgroup=true"
              target="_blank"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Add Guildxyz bot
            </Button>
          ) : (
            <Button h="10" w="full" disabled rightIcon={<Check />}>
              Guildxyz bot added
            </Button>
          )}
        </FormControl>
        <FormControl isInvalid={errors?.platformId}>
          <FormLabel>2. Enter group ID</FormLabel>
          <Input onChange={(e) => setValue("platformId", e.target.value)} />
          <FormErrorMessage>{errors?.platformId?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </>
  )
}

export default TelegramGroup
