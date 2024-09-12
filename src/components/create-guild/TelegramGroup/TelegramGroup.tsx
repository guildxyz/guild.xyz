import {
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
} from "@chakra-ui/react"
import { ArrowSquareOut, Check, QrCode } from "@phosphor-icons/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { env } from "env"
import { QRCodeSVG } from "qrcode.react"
import { PropsWithChildren } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useBoolean } from "usehooks-ts"
import parseFromObject from "utils/parseFromObject"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

type Props = {
  fieldName: string
}

const ADD_BOT_TO_GROUP_URL = `https://t.me/${env.NEXT_PUBLIC_TG_BOT_USERNAME}?startgroup=true&admin=post_messages+restrict_members+invite_users`

const QUICK_TRANSITION = { enter: { duration: 0.15 }, exit: { duration: 0.15 } }

const TelegramGroup = ({ fieldName, children }: PropsWithChildren<Props>) => {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext()

  const platformId = useWatch({
    name: fieldName,
  })

  const {
    data: { ok: isIn, message: errorMessage },
    isValidating,
  } = useIsTGBotIn(platformId, {
    refreshInterval: 5000,
    onSuccess: (data, _key, _config) => {
      if (data?.isIn) trigger(fieldName)
    },
  })

  const { value: isQR, toggle } = useBoolean()

  return (
    <>
      <Stack direction={{ base: "column" }} spacing="4" w="full">
        <FormControl>
          <div className="mb-2 flex items-center justify-between">
            <FormLabel mb="0">1. Add bot</FormLabel>
            {!isIn && (
              <Button
                leftIcon={<QrCode />}
                size="xs"
                borderRadius="lg"
                variant="ghost"
                my="-2"
                onClick={toggle}
              >
                {isQR ? "Show link" : "Show QR"}
              </Button>
            )}
          </div>

          <Collapse in={isQR && !isIn} transition={QUICK_TRANSITION}>
            <div className="flex justify-center">
              <div className="rounded-md border-4">
                <QRCodeSVG value={ADD_BOT_TO_GROUP_URL} size={300} />
              </div>
            </div>
          </Collapse>
          <Collapse in={!isQR || isIn} transition={QUICK_TRANSITION}>
            {isIn ? (
              <Button
                h="var(--chakra-space-11)"
                w="full"
                isDisabled
                rightIcon={<Check />}
              >
                Guild bot added
              </Button>
            ) : (
              <>
                <Button
                  w="full"
                  as="a"
                  h="var(--chakra-space-11)"
                  href={ADD_BOT_TO_GROUP_URL}
                  target="_blank"
                  rightIcon={<Icon as={ArrowSquareOut} mt="-1px" />}
                  isLoading={isValidating}
                >
                  Add Guild bot
                </Button>
                <FormHelperText>
                  If you have trouble adding the bot, please try on mobile with the
                  Show QR button above
                </FormHelperText>
              </>
            )}
          </Collapse>
        </FormControl>
        <FormControl isInvalid={!!parseFromObject(errors, fieldName)}>
          <FormLabel>2. Enter group ID</FormLabel>
          <Input
            h="var(--chakra-space-11)"
            borderRadius={"xl"}
            {...register(fieldName, {
              required: "This field is required.",
              minLength: {
                value: 9,
                message: "Invalid ID length",
              },
              pattern: {
                value: /^-[0-9]+$/i,
                message: "A Group ID starts with a '-' and contains only numbers",
              },
              validate: () => isIn || errorMessage,
            })}
          />
          <FormErrorMessage>
            {parseFromObject(errors, fieldName)?.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>
      {children && (
        <HStack justifyContent={"end"} mt={8}>
          {children}
        </HStack>
      )}
    </>
  )
}

export default TelegramGroup
