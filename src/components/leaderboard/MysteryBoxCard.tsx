import {
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Img,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import { Check, Gift } from "phosphor-react"
import { useForm } from "react-hook-form"
import useClaimMysteryBox from "./hooks/useClaimMysteryBox"
import useHasAlreadyClaimedMysteryBox from "./hooks/useHasAlreadyClaimedMysteryBox"

export type ClaimMysteryBoxForm = {
  country: string
  zipCode: string
  city: string
  street: string
  houseNumber: string
  email: string
}

const MysteryBoxCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ClaimMysteryBoxForm>()

  const {
    data: { alreadyClaimed },
  } = useHasAlreadyClaimedMysteryBox()

  const { onSubmit, isLoading, loadingText } = useClaimMysteryBox(onClose)

  return (
    <>
      <CardMotionWrapper>
        <Card px={{ base: 4, md: 6 }} py={{ base: 5, md: 7 }}>
          <Stack
            w="full"
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "start", md: "center" }}
            justifyContent={{ base: "start", md: "space-between" }}
            spacing={4}
          >
            <HStack spacing={4}>
              <Img
                display={{ base: "none", md: "block" }}
                src="/img/mystery-box.gif"
                alt="Guild Pin Mystery Box"
                position="relative"
                left={1}
                top={2}
                w={24}
                ml={-4}
              />
              <Stack>
                <Heading as="h2" fontSize="xl" fontFamily="display">
                  Congratulations!
                </Heading>
                <Text>
                  You're in the top 100 Guild Pin minters in Season 1, so now you can
                  claim your Guild Mystery Box! 👀
                </Text>
              </Stack>
            </HStack>

            <Button
              colorScheme="indigo"
              onClick={onOpen}
              leftIcon={alreadyClaimed ? <Check /> : <Gift />}
              isDisabled={alreadyClaimed}
              w={{ base: "full", md: "max-content" }}
              minW="max-content"
            >
              {alreadyClaimed ? "Claimed" : "Claim now!"}
            </Button>
          </Stack>
        </Card>
      </CardMotionWrapper>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4}>Claim Guild Mystery Box</ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <Text>
                All you need to do is to provide us your address where we can send
                the package, and then wait for the exclusive Guild goodies!
              </Text>

              <FormControl isInvalid={!!errors.country}>
                <FormLabel mb={4}>Shipping details</FormLabel>
                <Input
                  placeholder="Country"
                  {...register("country", { required: "Required" })}
                />
                <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
              </FormControl>

              <HStack alignItems="start">
                <FormControl maxW={28} isInvalid={!!errors.zipCode}>
                  <Input
                    placeholder="ZIP code"
                    {...register("zipCode", { required: "Required" })}
                  />
                  <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.city}>
                  <Input
                    placeholder="City"
                    {...register("city", { required: "Required" })}
                  />
                  <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack alignItems="start">
                <FormControl isInvalid={!!errors.street}>
                  <Input
                    placeholder="Street"
                    {...register("street", { required: "Required" })}
                  />
                  <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
                </FormControl>

                <FormControl maxW={28} isInvalid={!!errors.houseNumber}>
                  <Input
                    placeholder="Number"
                    {...register("houseNumber", { required: "Required" })}
                  />
                  <FormErrorMessage>{errors.houseNumber?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl>
                <Input
                  type="email"
                  placeholder="E-mail (optional)"
                  {...register("email")}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter pt={0}>
            <Button
              w="full"
              size="lg"
              colorScheme="indigo"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
              loadingText={loadingText}
            >
              Claim Mystery Box
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MysteryBoxCard
