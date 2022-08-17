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
import usePoapById from "components/create-guild/Requirements/components/PoapFormCard/hooks/usePoapById"
import { FormProvider, useForm, useWatch } from "react-hook-form"

const ImportPoap = (): JSX.Element => {
  const methods = useForm()
  const poapId = useWatch({ control: methods.control, name: "poapId" })

  const { isPoapByIdLoading, poap } = usePoapById(poapId)

  return (
    <FormProvider {...methods}>
      <Stack textAlign="left">
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
            <Button isDisabled={!poap} h={10} borderRadius="lg">
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
            or create a new POAP
          </Text>
          <Divider />
        </HStack>
      </Stack>
    </FormProvider>
  )
}

export default ImportPoap
