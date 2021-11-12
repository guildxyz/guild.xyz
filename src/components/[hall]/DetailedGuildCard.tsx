import {
  GridItem,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import useIsMember from "components/[guild]/JoinButton/hooks/useIsMember"
import useLevelsAccess from "components/[guild]/JoinButton/hooks/useLevelsAccess"
import { Check, CheckCircle, X } from "phosphor-react"
import { Guild } from "temporaryData/types"

type Props = {
  guildData: Guild
}

const DetailedGuildCard = ({ guildData }: Props): JSX.Element => {
  const {
    data: hasAccess,
    error,
    isLoading,
  } = useLevelsAccess("guild", guildData.id)
  const isMember = useIsMember("guild", guildData.id)

  const colorScheme = () => {
    if (isMember) return "green"
    if (hasAccess) return "blue"
    return "gray"
  }

  return (
    <Card
      isFullWidthOnMobile
      px={{ base: 5, sm: 7 }}
      py={{ base: 8, md: 10 }}
      width="full"
    >
      <Stack direction={{ base: "column", md: "row" }} spacing={6}>
        <SimpleGrid
          width="full"
          templateColumns={{ base: "1fr auto", md: "auto 1fr" }}
          columnGap={{ base: 4, sm: 6 }}
          rowGap={6}
          alignItems="center"
        >
          <GridItem order={{ md: 1 }}>
            <Heading size="md" mb="3" fontFamily="display">
              {guildData.name}
            </Heading>

            <Wrap>
              {guildData.requirements.map((requirement) => (
                <Tag key={requirement.address}>{requirement.symbol}</Tag>
              ))}
            </Wrap>
          </GridItem>

          <GridItem order={{ md: 0 }}>
            {guildData.imageUrl && (
              <GuildLogo imageUrl={guildData.imageUrl} size={14} iconSize={5} />
            )}
          </GridItem>

          {guildData.description && (
            <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
              <Text colorScheme="gray" fontSize="md">
                {guildData.description}
              </Text>
            </GridItem>
          )}
        </SimpleGrid>

        <Stack
          direction={{ base: "row", md: "column" }}
          alignItems={{ base: "center", md: "flex-end" }}
          justifyContent={{
            base: "space-between",
            md: "center",
          }}
        >
          {!error && (
            <Tag colorScheme={colorScheme()}>
              {isMember ? (
                <>
                  <TagLeftIcon boxSize={4} as={CheckCircle} />
                  <TagLabel>You're in</TagLabel>
                </>
              ) : isLoading ? (
                <>
                  <TagLeftIcon boxSize={3} as={Spinner} />
                  <TagLabel>Checking access</TagLabel>
                </>
              ) : hasAccess ? (
                <>
                  <TagLeftIcon boxSize={4} as={Check} />
                  <TagLabel>You have access</TagLabel>
                </>
              ) : (
                <>
                  <TagLeftIcon boxSize={4} as={X} />
                  <TagLabel>No access</TagLabel>
                </>
              )}
            </Tag>
          )}
        </Stack>
      </Stack>
    </Card>
  )
}

export default DetailedGuildCard
