import {
  Flex,
  FormControl,
  FormLabel,
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
import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import usePoapById from "requirements/Poap/hooks/usePoapById"
import convertPoapExpiryDate from "utils/convertPoapExpiryDate"
import useSavePoap from "../hooks/useSavePoap"
import { useCreatePoapContext } from "./CreatePoapContext"
import UploadMintLinks from "./UploadMintLinks"

const ImportPoap = ({ setStep }): JSX.Element => {
  const { id } = useGuild()

  const methods = useForm()
  const poapId = useWatch({ control: methods.control, name: "poapId" })

  const { isPoapByIdLoading, poap } = usePoapById(poapId)

  const { setPoapData } = useCreatePoapContext()
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
  }, [response])

  return (
    <FormProvider {...methods}>
      <Stack textAlign="left" spacing={6}>
        <FormControl>
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
              colorScheme="green"
              isDisabled={!poap || !!response}
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
        <UploadMintLinks poapId={poapId} />
      </Stack>
      <Flex justifyContent={"right"} pt="2" mt="auto">
        <Button colorScheme="indigo" onClick={() => setStep("requirements")}>
          Next
        </Button>
      </Flex>
    </FormProvider>
  )
}

export default ImportPoap
