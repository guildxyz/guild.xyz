import {
  Center,
  ChakraProps,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ErrorAlert from "components/common/ErrorAlert"
import DCServerCard from "components/guard/setup/DCServerCard"
import ServerSetupCard from "components/guard/setup/ServerSetupCard"
import useGuild from "components/[guild]/hooks/useGuild"
import useDCAuth from "components/[guild]/JoinModal/hooks/useDCAuth"
import { AnimatePresence } from "framer-motion"
import useUsersServers from "hooks/useUsersServers"
import { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"

const DiscordGuildSetup = ({
  defaultValues,
  selectedServer,
  fieldName,
  children,
  rolePlatforms = undefined,
  onSubmit = undefined,
}) => {
  const { reset, setValue } = useFormContext()

  const { authorization } = useDCAuth("guilds")

  const { servers, isValidating } = useUsersServers(authorization)

  const selectedServerOption = useMemo(
    () => servers?.find((server) => server.id === selectedServer),
    [selectedServer] // servers excluded on purpose
  )

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedServer)
      setTimeout(() => {
        setShowForm(true)
      }, 300)
    else setShowForm(false)
  }, [selectedServer])

  const resetForm = () => {
    reset(defaultValues)
    setValue(fieldName, null)
  }

  const guild = useGuild()

  const guildPlatformsOfRole = guild?.guildPlatforms?.filter((gp) =>
    rolePlatforms?.some((rp) => rp.guildPlatformId === gp.id)
  )

  useEffect(() => console.log(rolePlatforms), [rolePlatforms])

  type Props = {
    size?: "md" | "lg"
  } & ChakraProps

  if (((!servers || servers.length <= 0) && isValidating) || !authorization) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        {[...Array(5)].map(() => {
          return (
            <GridItem>
              <Card>
                <Center py={{ base: 12, md: 20 }} bg="gray.600">
                  <SkeletonCircle pos="absolute" boxSize={{ base: 20, md: 24 }} />
                </Center>
                <HStack px={{ base: 5, md: 4 }} py={5} spacing={6}>
                  <Grid w="full" gap={2.5}>
                    <Skeleton h={3} maxWidth={250} />
                    <Skeleton h={2} w={50} />
                  </Grid>
                  <Skeleton
                    h={10}
                    borderRadius="xl"
                    w={210}
                    maxWidth={220}
                    opacity={0.4}
                  />
                </HStack>
              </Card>
            </GridItem>
          )
        })}
      </SimpleGrid>
    )

    // <HStack spacing="6" py="5">
    //   <Spinner size="md" />
    //   <Text fontSize="lg">Loading servers...</Text>
    // </HStack>
  }

  if (servers?.length <= 0) {
    return (
      <ErrorAlert label="Seem like you're not an admin of any Discord server yet" />
    )
  }

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        <AnimatePresence>
          {(selectedServerOption ? [selectedServerOption] : servers ?? [])
            .filter(
              guildPlatformsOfRole
                ? (serverData) =>
                    guildPlatformsOfRole?.every(
                      (gp) => gp.platformGuildId != serverData.id
                    )
                : () => true
            )
            .map((serverData) => (
              <CardMotionWrapper key={serverData.id}>
                <GridItem>
                  <DCServerCard
                    serverData={serverData}
                    onSelect={
                      selectedServer
                        ? undefined
                        : (newServerId) => setValue(fieldName, newServerId)
                    }
                    onCancel={
                      selectedServer !== serverData.id
                        ? undefined
                        : () => resetForm()
                    }
                  />
                </GridItem>
              </CardMotionWrapper>
            ))}
        </AnimatePresence>
        {showForm && (
          <GridItem colSpan={2}>
            <ServerSetupCard onSubmit={onSubmit}>{children}</ServerSetupCard>
          </GridItem>
        )}
      </SimpleGrid>
    </>
  )
}

export default DiscordGuildSetup
