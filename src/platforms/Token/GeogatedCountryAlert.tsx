import { Link } from "@chakra-ui/next-js"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Icon,
  Stack,
} from "@chakra-ui/react"
import { IpGeodata } from "pages/api/ip-geodata"
import { ArrowSquareOut } from "phosphor-react"
import useSWRImmutable from "swr/immutable"

const BLOCKED_COUNTRY_CODES = ["US", "CA", "AF", "IR", "CU"]

const useIsFromGeogatedCountry = () => {
  const { data } = useSWRImmutable<IpGeodata>("/ip-geodata")

  if (!data) return null

  return BLOCKED_COUNTRY_CODES?.includes(data.country)
}

export const GeogatedCountryAlert = () => {
  const isFromGeogatedCountry = useIsFromGeogatedCountry()

  /**
   * TODO: we probably shouldn't have this in this form, but showing it earlier like
   * a popover when hovering over disabled claim button - hence I haven't disabled
   * action buttons in the ClaimModal accordingly, this is just an initial version
   */
  return (
    <Collapse in={isFromGeogatedCountry}>
      <Alert status="warning" mb="6" mt="3" pb="5">
        <AlertIcon />
        <Stack>
          <AlertTitle position="relative" top={"3px"} fontWeight="semibold">
            Claiming is not available in your country
          </AlertTitle>
          <AlertDescription>
            {`Your country has strict regulations for crypto, so claiming tokens on Guild is
            not available. `}
            {/* TODO: add intercom article about the restriction */}
            <Link
              href="#"
              // isExternal
              fontWeight={"semibold"}
              opacity="0.8"
            >
              Learn more
              <Icon as={ArrowSquareOut} ml="0.5" />
            </Link>
          </AlertDescription>
        </Stack>
      </Alert>
    </Collapse>
  )
}
