import {
  Grid,
  HStack,
  Icon,
  Img,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import dynamic from "next/dynamic"
import {
  Brain,
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

const AnimatedLogo = dynamic(() => import("components/explorer/AnimatedLogo"), {
  ssr: false,
  loading: () => <Img src="/guildLogos/logo.svg" boxSize={4} />,
})

const NavMenu = (): JSX.Element => (
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
        data-dd-action-name="Navigation menu"
      >
        <HStack spacing={"7px"}>
          <AnimatedLogo />
          <Text as="span">Guild</Text>
        </HStack>
      </Button>
    </PopoverTrigger>
    <PopoverContent w="auto" minW="xs" borderRadius={"lg"} py="2">
      <PopoverBody px={{ base: 2, sm: 3 }}>
        <Grid
          templateColumns={{ base: "1fr", sm: "1fr 150px" }}
          gap={{ base: 2, sm: 12 }}
        >
          <NavGroup title="Navigation">
            <NavButton
              leftIcon={<House />}
              data-dd-action-name="Navigation menu - Landing"
              href="/"
            >
              About Guild.xyz
            </NavButton>
            <NavButton
              leftIcon={<MagnifyingGlass />}
              data-dd-action-name="Navigation menu - Explorer"
              href="/explorer"
            >
              Explore all guilds
            </NavButton>
            <NavButton
              leftIcon={<Plus />}
              data-dd-action-name="Navigation menu - Balancy playground"
              href="/create-guild"
            >
              Create guild
            </NavButton>
            <NavButton
              leftIcon={<Cpu />}
              data-dd-action-name="Navigation menu - Balancy playground"
              href="/balancy"
            >
              Balancy playground
            </NavButton>
            <NavButton
              leftIcon={<Brain />}
              data-dd-action-name="Navigation menu - Guildverse"
              href="/guildverse"
            >
              Guildverse
            </NavButton>
          </NavGroup>
          <NavGroup title="Other">
            <NavButton
              target="_blank"
              href="https://discord.gg/guildxyz"
              rel="noopener"
              leftIcon={<DiscordLogo />}
              data-dd-action-name="Navigation menu - Discord"
            >
              Discord
            </NavButton>
            <NavButton
              target="_blank"
              href="https://twitter.com/guildxyz"
              rel="noopener"
              leftIcon={<TwitterLogo />}
              data-dd-action-name="Navigation menu - Twitter"
            >
              Twitter
            </NavButton>
            <NavButton
              target="_blank"
              href="https://github.com/agoraxyz/guild.xyz"
              rel="noopener"
              leftIcon={<Code />}
              data-dd-action-name="Navigation menu - Code"
            >
              Code
            </NavButton>
            <NavButton
              target="_blank"
              href="https://docs.guild.xyz/guild"
              rel="noopener"
              leftIcon={<Info />}
              data-dd-action-name="Navigation menu - Guide"
            >
              Guide
            </NavButton>
          </NavGroup>
        </Grid>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)

export default NavMenu
