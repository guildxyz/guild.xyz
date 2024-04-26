import {
  Box,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { POPOVER_HEADER_STYLES } from "components/[guild]/Requirements/components/RequirementAccessIndicator"
import { triggerChat } from "components/_app/IntercomProvider"
import Button from "components/common/Button"
import { IpGeodata } from "pages/api/ip-geodata"
import { ArrowSquareIn } from "phosphor-react"
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
  const { data } = useSWRImmutable<IpGeodata>("/ip-geodata")

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
          <PopoverHeader {...POPOVER_HEADER_STYLES}>
            Claiming is not available in your country
          </PopoverHeader>
          <PopoverBody pt="0">
            {`Sorry, but this feature is currently not available in your country. We understand your frustration and are working hard to make it legally accessible. If you have any questions, feel free to `}
            <Button
              variant="link"
              fontWeight={"semibold"}
              opacity="0.8"
              onClick={triggerChat}
            >
              reach out to us
              <Icon as={ArrowSquareIn} ml="0.5" mb="-0.5" />
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
