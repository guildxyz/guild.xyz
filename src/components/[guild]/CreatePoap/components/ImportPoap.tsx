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
import useToast from "hooks/useToast"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import usePoapById from "requirements/Poap/hooks/usePoapById"
import convertPoapExpiryDate from "utils/convertPoapExpiryDate"
import { AddPoapStep } from "../AddPoapModalContent"
import useSavePoap from "../hooks/useSavePoap"
import { useCreatePoapContext } from "./CreatePoapContext"
import UploadMintLinks from "./UploadMintLinks"

type Props = {
  setStep: (step: AddPoapStep) => void
}

const ImportPoap = ({ setStep }: Props): JSX.Element => {
  const { id } = useGuild()
  const toast = useToast()

  const methods = useForm()
  const poapId = useWatch({ control: methods.control, name: "poapId" })

  const { isPoapByIdLoading, poap } = usePoapById(poapId)

  const { setPoapData } = useCreatePoapContext()
  const { onSubmit, isLoading, response } = useSavePoap({
    onSuccess: () => {
      toast({ status: "success", title: "POAP successfully imported" })
      setPoapData(poap)
    },
  })

  const importPoap = () => {
    onSubmit({
      guildId: id,
      poapId: poap?.id,
      fancyId: poap?.fancy_id,
      expiryDate: convertPoapExpiryDate(poap?.expiry_date),
    })
  }

  return (
    <FormProvider {...methods}>
      <Stack textAlign="left" spacing={6}>
        <FormControl>
          <FormLabel>POAP ID:</FormLabel>
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
        <Button
          colorScheme="indigo"
          onClick={() => setStep("requirements")}
          isDisabled={!response}
        >
          Next
        </Button>
      </Flex>
    </FormProvider>
  )
}

export default ImportPoap
