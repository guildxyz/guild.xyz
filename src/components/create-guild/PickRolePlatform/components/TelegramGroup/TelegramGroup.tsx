import { Button, FormControl, FormLabel, Input, SimpleGrid } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

const TelegramGroup = () => {
  const router = useRouter()
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext()

  const platformId = useWatch({ name: "platformId" })

  useEffect(() => {
    if (router.query.groupId) {
      setValue("platformId", router.query.groupId?.toString())
    }
  }, [router.query])

  const {
    data: { ok: isIn, message: errorMessage },
    isLoading,
  } = useIsTGBotIn(platformId)

  useEffect(() => {
    if (isIn && !errorMessage) {
      trigger("platformId")
    }
  }, [isIn, errorMessage])

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
          <Input
            {...register("platformId", {
              required: "This field is required.",
              validate: () => isIn || errorMessage,
            })}
          />
          <FormErrorMessage>{errors?.platformId?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </>
  )
}

export default TelegramGroup
