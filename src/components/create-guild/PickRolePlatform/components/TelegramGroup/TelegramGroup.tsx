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
import { getRandomInt } from "components/create-guild/IconSelector/IconSelector"
import { Check } from "phosphor-react"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import pinataUpload from "utils/pinataUpload"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

type Props = {
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
}

const GUILD_LOGO_REGEX = /^\/guildLogos\/[0-9]+\.svg$/

const TelegramGroup = ({ setUploadPromise }: Props) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const {
    register,
    trigger,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const platform = useWatch({ name: "platform" })
  const platformId = useWatch({ name: "TELEGRAM.platformId" })

  const {
    data: { ok: isIn, message: errorMessage, groupIcon, groupName },
    isLoading,
  } = useIsTGBotIn(platformId)

  useEffect(() => {
    if (!!touchedFields.name || !groupName || groupName.length <= 0) return
    setValue("name", groupName, { shouldValidate: true })
  }, [groupName])

  const imageUrl = useWatch({ name: "imageUrl" })

  useEffect(() => {
    if (touchedFields.imageUrl) return
    if (!groupIcon || groupIcon.length <= 0) {
      if (
        !touchedFields.imageUrl &&
        imageUrl?.length > 0 &&
        !GUILD_LOGO_REGEX.test(imageUrl)
      ) {
        // The image has been set by us (by invite or group id paste)
        setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
      }
      return
    }
    setValue("imageUrl", groupIcon)
    setUploadPromise(
      fetch(groupIcon)
        .then((response) => response.blob())
        .then((blob) =>
          pinataUpload({
            data: [new File([blob], `${groupName}.png`, { type: "image/png" })],
          }).then(({ IpfsHash }) => {
            setValue(
              "imageUrl",
              `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
            )
          })
        )
    )
  }, [groupIcon])

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
