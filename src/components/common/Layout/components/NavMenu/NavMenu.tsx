import {
  Grid,
  HStack,
  Icon,
  Img,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import dynamic from "next/dynamic"
import {
  Brain,
  CircleWavyCheck,
  Code,
  Cpu,
  DiscordLogo,
  House,
  Info,
  List,
  MagnifyingGlass,
  Plus,
  TwitterLogo,
} from "phosphor-react"
import NavButton from "./components/NavButton"
import NavGroup from "./components/NavGroup"
import ThemeSwitcher from "./components/ThemeSwitcher"

const AnimatedLogo = dynamic(() => import("components/explorer/AnimatedLogo"), {
  ssr: false,
  loading: () => <Img src="/guildLogos/logo.svg" boxSize={4} />,
})

const NavMenu = (): JSX.Element => {
  const darkBgColor = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          aria-label="Navigation menu"
          rightIcon={<Icon as={List} mt="1px" />}
          iconSpacing="3"
          fontFamily={"display"}
          fontWeight="black"
          borderRadius={"2xl"}
          variant="ghost"
        >
          <HStack spacing={"7px"}>
            <AnimatedLogo />
            <Text as="span">Guild</Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto" minW="xs" borderRadius={"lg"} overflow={"hidden"}>
        <PopoverBody px={{ base: 2, sm: 3 }} py="4">
          <Grid
            templateColumns={{ base: "1fr", sm: "1fr 150px" }}
            gap={{ base: 2, sm: 12 }}
          >
            <NavGroup title="Navigation">
              <NavButton leftIcon={<House />} href="/">
                About Guild.xyz
              </NavButton>
              <NavButton leftIcon={<MagnifyingGlass />} href="/explorer">
                Explore all guilds
              </NavButton>
              <NavButton leftIcon={<Plus />} href="/create-guild">
                Create guild
              </NavButton>
              <NavButton leftIcon={<Cpu />} href="/balancy">
                Balancy playground
              </NavButton>
              <NavButton leftIcon={<Brain />} href="/guildverse">
                Guildverse
              </NavButton>
              <NavButton leftIcon={<CircleWavyCheck />} href="/leaderboard">
                Guild Pins leaderboard
              </NavButton>
            </NavGroup>
            <NavGroup title="Other">
              <NavButton
                target="_blank"
                href="https://discord.gg/guildxyz"
                rel="noopener"
                leftIcon={<DiscordLogo />}
              >
                Discord
              </NavButton>
              <NavButton
                target="_blank"
                href="https://twitter.com/guildxyz"
                rel="noopener"
                leftIcon={<TwitterLogo />}
              >
                Twitter
              </NavButton>
              <NavButton
                target="_blank"
                href="https://github.com/agoraxyz/guild.xyz"
                rel="noopener"
                leftIcon={<Code />}
              >
                Code
              </NavButton>
              <NavButton
                target="_blank"
                href="https://help.guild.xyz"
                rel="noopener"
                leftIcon={<Info />}
              >
                Guide
              </NavButton>
            </NavGroup>
          </Grid>
        </PopoverBody>
        <PopoverFooter bg={darkBgColor} border="none">
          <HStack p="4" justifyContent={"space-between"}>
            <Text fontSize="sm">Theme:</Text>
            <ThemeSwitcher />
          </HStack>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

export default NavMenu
