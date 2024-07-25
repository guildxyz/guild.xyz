import { Link } from "@chakra-ui/next-js"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Img,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { Chain, schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import useCountdownDate from "components/[guild]/contests/hooks/useCountdownDate"
import useCreateGuildContest from "components/[guild]/contests/hooks/useCreateGuildContest"
import useGuildContests from "components/[guild]/contests/hooks/useGuildContests"
import useGuild from "components/[guild]/hooks/useGuild"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import DisplayCard from "components/common/DisplayCard"
import { Layout } from "components/common/Layout"
import { Modal } from "components/common/Modal"
import PhotoUploader from "components/create-guild/IconSelector/components/PhotoUploader"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { useEffect } from "react"
import { FormProvider, useForm, useFormState } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import { useFarcasterChannel } from "requirements/Farcaster/hooks/useFarcasterChannels"
import { z } from "zod"

const Page = () => {
  const { name } = useGuild()
  const { data } = useGuildContests()

  return (
    <Layout.Root>
      <Layout.Head ogTitle={`Contests - ${name}`} />
      <Layout.HeaderSection>
        <Layout.Background />
        <Layout.Header />
        <Layout.Headline title={"Contests"} />
      </Layout.HeaderSection>
      <Layout.MainSection>
        <GuildTabs activeTab="CONTESTS" />

        <VStack alignItems={"start"} spacing={4}>
          <CreateContestButton />

          <SimpleGrid columns={2} gap={4} w="full">
            {data?.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </SimpleGrid>
        </VStack>
      </Layout.MainSection>
    </Layout.Root>
  )
}

function ContestCard({
  contest,
}: {
  contest: z.output<typeof schemas.GuildContestSchema>
}) {
  const { urlName } = useGuild()

  const hasEnded = +new Date(contest.endTime) < Date.now()
  const [{ days, hours, minutes, seconds }, { startCountdown }] = useCountdownDate(
    new Date(contest.endTime)
  )

  const channel = useFarcasterChannel(
    contest.parentUrl.startsWith("https://warpcast.com/~/channel")
      ? contest.parentUrl.split("/").pop()
      : undefined
  )

  useEffect(() => {
    startCountdown()
  }, [startCountdown])

  return (
    <Link
      _hover={{ textDecor: "none" }}
      w="full"
      href={`/${urlName}/contests/${contest.id}`}
    >
      <DisplayCard w="full" key={contest.id} px={4} py={4}>
        <HStack spacing={3}>
          {contest.img ? (
            <Img src={contest.img} boxSize={12} borderRadius={"full"} />
          ) : null}

          <VStack alignItems={"start"} spacing={1} w="full">
            <HStack w="full" justifyContent={"space-between"}>
              <Text fontSize={"large"} fontWeight={"bold"}>
                {contest.name}
              </Text>
              {channel.data ? (
                <>
                  <Tag borderRadius="full">
                    {!!channel.data.img && typeof channel.data.img === "string" ? (
                      <Img
                        borderRadius={"full"}
                        src={channel.data.img}
                        boxSize={4}
                        mr={1}
                      />
                    ) : null}
                    <TagLabel>{channel.data.label}</TagLabel>
                  </Tag>
                </>
              ) : null}
            </HStack>

            {hasEnded ? (
              <Text>This contest has ended</Text>
            ) : (
              <Text>
                Ends in{days > 0 ? ` ${days} days` : " "}
                {hours > 0 || days > 0 ? ` ${hours} hours` : " "}
                {hours > 0 || days > 0 || minutes > 0 ? ` ${minutes} minutes` : " "}
                {hours > 0 || days > 0 || minutes > 0 || seconds > 0
                  ? ` ${seconds} seconds`
                  : " "}
              </Text>
            )}
          </VStack>
        </HStack>
      </DisplayCard>
    </Link>
  )
}

function CreateContestButton() {
  const { id } = useGuild()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const methods = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1),
        channel: z.string(),
        deadline: z.string().pipe(z.coerce.date()),
        chain: z.string().min(1), // TODO
        img: z.string().min(1).url(),
      })
    ),
    mode: "all",
    defaultValues: {
      name: "",
      channel: "",
      deadline: null as Date | null,
      chain: "ETHEREUM" as Chain,
      img: null as null | string,
    },
  })

  const { onSubmit, isLoading } = useCreateGuildContest({
    onSuccess: () => {
      onClose()
      methods.reset()
    },
  })

  const { errors } = useFormState({ control: methods.control })

  const imgUploader = usePinata({
    fieldToSetOnSuccess: "img",
    fieldToSetOnError: "img",
    control: methods.control,
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    () => {
      methods.handleSubmit((data) => {
        if (!id) {
          return
        }

        onSubmit({
          chain: data.chain,
          endTime: data.deadline as Date,
          name: data.name,
          parentUrl:
            data.channel.length > 0
              ? `https://warpcast.com/~/channel/${data.channel}`
              : "http://localhost:3000",
          guildId: id,
          img: data.img || undefined,
        })
      })()
    },
    imgUploader.isUploading
  )

  return (
    <>
      <Button onClick={onOpen}>Create Contest</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4}>Create Contest</ModalHeader>

          <ModalBody>
            <FormProvider {...methods}>
              <VStack>
                <FormControl
                  isRequired
                  isInvalid={!!errors.name?.message?.toString()}
                >
                  <FormLabel>Name</FormLabel>
                  <Input {...methods.register("name")} />
                  <FormErrorMessage>
                    {errors.name?.message?.toString()}
                  </FormErrorMessage>
                </FormControl>

                <PhotoUploader uploader={imgUploader} label="Contest image" />

                <FormControl>
                  <FormLabel>Channel</FormLabel>
                  <Input {...methods.register("channel")} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Deadline</FormLabel>
                  <Input type="date" {...methods.register("deadline")} />
                </FormControl>
                <ChainPicker controlName="chain" showDivider={false} />
              </VStack>
            </FormProvider>
          </ModalBody>

          <ModalFooter>
            <Button
              size="lg"
              w="full"
              colorScheme="green"
              isLoading={isLoading || isUploadingShown}
              loadingText={uploadLoadingText}
              onClick={handleSubmit}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const PageWrapper = (): JSX.Element => (
  <ThemeProvider>
    <Page />
  </ThemeProvider>
)

export default PageWrapper
