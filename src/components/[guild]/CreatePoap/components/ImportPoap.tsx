import {
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import usePoapById from "components/create-guild/Requirements/components/PoapForm/hooks/usePoapById"
import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import convertPoapExpiryDate from "utils/convertPoapExpiryDate"
import useSavePoap from "../hooks/useSavePoap"
import { useCreatePoapContext } from "./CreatePoapContext"

const ImportPoap = (): JSX.Element => {
  const { id } = useGuild()

  const methods = useForm()
  const poapId = useWatch({ control: methods.control, name: "poapId" })

  const { isPoapByIdLoading, poap } = usePoapById(poapId)

  const { setPoapData, nextStep } = useCreatePoapContext()
  const { onSubmit, isLoading, response } = useSavePoap()

  const importPoap = () => {
    onSubmit({
      guildId: id,
      poapId: poap?.id,
      fancyId: poap?.fancy_id,
      expiryDate: convertPoapExpiryDate(poap?.expiry_date),
    })
  }

  useEffect(() => {
    if (!response) return
    setPoapData(poap)
    nextStep()
  }, [response])

  return (
    <FormProvider {...methods}>
      <Stack textAlign="left">
        <HStack py={8}>
          <Divider />
          <Text
            as="span"
            fontWeight="bold"
            fontSize="sm"
            color="gray"
            textTransform="uppercase"
            minW="max-content"
          >
            or import an existing POAP
          </Text>
          <Divider />
        </HStack>

        <Heading as="h4" fontSize="lg" fontFamily="display">
          Already created a POAP?
        </Heading>
        <Text>
          You can import your POAP to Guild.xyz by pasting its ID in the field below.
        </Text>

        <FormControl pt={2}>
          <FormLabel>Event ID:</FormLabel>
          <HStack>
            <InputGroup maxW={{ base: 40, sm: 52 }}>
              <Input {...methods.register("poapId")} />
              {isPoapByIdLoading && (
                <InputRightElement>
                  <Spinner size="sm" />
                </InputRightElement>
              )}
            </InputGroup>
            <Button
              isDisabled={!poap}
              h={10}
              borderRadius="lg"
              onClick={importPoap}
              isLoading={isLoading}
              loadingText="Importing"
            >
              Import POAP
            </Button>
          </HStack>

          {poap && (
            <HStack pt={2}>
              <Img src={poap.image_url} alt={poap.name} boxSize={6} rounded="full" />
              <Text as="span" fontSize="sm" fontWeight="semibold" color="gray">
                {poap.name}
              </Text>
            </HStack>
          )}
        </FormControl>
      </Stack>
    </FormProvider>
  )
}

export default ImportPoap
