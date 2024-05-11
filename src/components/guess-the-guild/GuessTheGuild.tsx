import { Center, Text } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { GuildBase } from "types"

type Props = {
  guildData: GuildBase[]
}
const GuessTheGuild = ({ guildData }: Props): JSX.Element => {
  const randomGuild: GuildBase =
    guildData[Math.floor(Math.random() * guildData.length)]

  const possibleGuilds = [
    ...guildData.sort(() => Math.random() - Math.random()).slice(0, 3),
    randomGuild,
  ].sort(() => Math.random() - Math.random())
  console.log("possibleGuilds", possibleGuilds)
  console.log("randomGuild", randomGuild)

  return (
    <>
      <Center mt="6">
        <GuildLogo imageUrl={randomGuild.imageUrl} />
      </Center>
      <Center mt="3" mb="6">
        ???
      </Center>

      {possibleGuilds.map((guild) => (
        <Center key={guild.id}>
          <Text>{guild.name}</Text>
        </Center>
      ))}
    </>
  )
}

export default GuessTheGuild
