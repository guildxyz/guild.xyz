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
import { useSetAtom } from "jotai"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { explorerScrollRestorationAtom } from "pages/explorer"
import {
  CircleWavyCheck,
  Code,
  DiscordLogo,
  File,
  House,
  Info,
  List,
  Palette,
  Plus,
  Shield,
} from "phosphor-react"
import XLogo from "static/icons/x.svg"
import NavButton from "./components/NavButton"
import NavGroup from "./components/NavGroup"
import ThemeSwitcher from "./components/ThemeSwitcher"

const AnimatedLogo = dynamic(() => import("components/explorer/AnimatedLogo"), {
  ssr: false,
  loading: () => <Img src="/guildLogos/logo.svg" boxSize={4} />,
})

const NavMenu = (): JSX.Element => {
  const darkBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const setExplorerScrollRestoration = useSetAtom(explorerScrollRestorationAtom)
  const router = useRouter()

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          className="navMenu"
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
      <PopoverContent
        w="auto"
        minW="xs"
        borderRadius={"lg"}
        overflow={"hidden"}
        zIndex="popover"
      >
        <PopoverBody px={{ base: 2, sm: 3 }} py="4">
          <Grid
            templateColumns={{ base: "1fr", sm: "1fr 150px" }}
            gap={{ base: 2, sm: 12 }}
          >
            <NavGroup title="Navigation">
              <NavButton
                leftIcon={<House />}
                href="/explorer"
                onClick={(e) => {
                  e.preventDefault()
                  setExplorerScrollRestoration(false)
                  router.push("/explorer")
                }}
              >
                Explore guilds
              </NavButton>
              <NavButton leftIcon={<Plus />} href="/create-guild">
                Create guild
              </NavButton>
              <NavButton leftIcon={<CircleWavyCheck />} href="/leaderboard">
                Guild Pins leaderboard
              </NavButton>
              <NavButton leftIcon={<Shield />} href="/privacy-policy">
                Privacy Policy
              </NavButton>
              <NavButton leftIcon={<File />} href="/terms-of-use">
                Terms of Use
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
                leftIcon={<XLogo />}
              >
                Twitter
              </NavButton>
              <NavButton
                target="_blank"
                href="https://github.com/guildxyz/guild.xyz"
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
              <NavButton
                target="_blank"
                href="https://guild.xyz/guild-xyz-brand-kit.zip"
                rel="noopener"
                leftIcon={<Palette />}
              >
                Brand kit
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
