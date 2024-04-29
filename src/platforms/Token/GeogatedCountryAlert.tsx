import {
  Box,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { triggerChat } from "components/_app/IntercomProvider"
import Button from "components/common/Button"
import { IpGeodata } from "pages/api/ip-geodata"
import { Chat } from "phosphor-react"
import useSWRImmutable from "swr/immutable"

const BLOCKED_COUNTRY_CODES = [
  "US",
  "CA",
  "AF",
  "AO",
  "CF",
  "CG",
  "CD",
  "CU",
  "CI",
  "GW",
  "IR",
  "KP",
  "LB",
  "LR",
  "LY",
  "ML",
  "MM",
  "NI",
  "SO",
  "SS",
  "SD",
  "SY",
  "VE",
  "VI",
  "YE",
  "ZW",
]

export const useIsFromGeogatedCountry = () => {
  const { data } = useSWRImmutable<IpGeodata>("/api/ip-geodata")

  if (!data) return null

  return BLOCKED_COUNTRY_CODES?.includes(data.country)
}

export const GeogatedCountryPopover = ({ children, isDisabled }) => {
  if (isDisabled) return children

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>

      <Portal>
        <PopoverContent w="md">
          <PopoverArrow />
          <PopoverHeader
            // same as POPOVER_HEADER_STYLES, but there's a build error for some reason if we import that here. This could be moved to theme config probably anyway
            {...{
              fontWeight: "semibold",
              border: "0",
              px: "3",
            }}
          >
            Claiming is not available in your country
          </PopoverHeader>
          <PopoverBody pt="0">
            {`Sorry, but this feature is currently `}
            <Link
              href="https://help.guild.xyz/en/articles/9246601-restricted-countries"
              isExternal
              display="inline"
              colorScheme="blue"
            >
              not available in your country.
            </Link>
            {` We understand your frustration and are working hard to make it legally accessible. If you have any questions, feel free to `}
            <Button
              variant="link"
              fontWeight={"semibold"}
              onClick={triggerChat}
              opacity="0.8"
            >
              reach out to us
              <Icon as={Chat} ml="1" mb="-0.5" />
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
