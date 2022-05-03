import {
  FormControl,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
} from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Check } from "phosphor-react"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import useSetImageAndNameFromPlatformData from "../../hooks/useSetImageAndNameFromPlatformData"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

type Props = {
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
}

const TelegramGroup = ({ setUploadPromise }: Props) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const platform = useWatch({ name: "platform" })
  const platformId = useWatch({ name: "TELEGRAM.platformId" })

  const {
    data: { ok: isIn, message: errorMessage, groupIcon, groupName },
    isLoading,
  } = useIsTGBotIn(platformId)

  useSetImageAndNameFromPlatformData(groupIcon, groupName, setUploadPromise)

  // Sending actionst & errors to datadog
  useEffect(() => {
    if (!platformId) return
    addDatadogAction("Pasted a Telegram group ID")
  }, [platformId])

  useEffect(() => {
    if (!isIn || errorMessage) {
      addDatadogError("Telegram group ID error", { error: errorMessage }, "custom")
      return
    }

    if (isIn && !errorMessage) {
      trigger("TELEGRAM.platformId")
      addDatadogAction("Successful platform setup")
      addDatadogAction("Telegram bot added successfully")
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
              data-dd-action-name="Add bot (TELEGRAM)"
            >
              Add Guild bot
            </Button>
          ) : (
            <Button h="10" w="full" disabled rightIcon={<Check />}>
              Guild bot added
            </Button>
          )}
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <FormControl isInvalid={!!errors?.TELEGRAM?.platformId}>
            <FormLabel>2. Enter group ID</FormLabel>
            <Input
              maxW={{ base: "full", lg: "50%" }}
              {...register("TELEGRAM.platformId", {
                required: platform === "TELEGRAM" && "This field is required.",
                pattern: {
                  value: /^-[0-9]+/i,
                  message: "A Group ID starts with a '-' and contains only numbers",
                },
                validate: () => platform !== "TELEGRAM" || isIn || errorMessage,
              })}
            />
            <FormErrorMessage>
              {errors?.TELEGRAM?.platformId?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>
      </SimpleGrid>
    </>
  )
}

export default TelegramGroup
