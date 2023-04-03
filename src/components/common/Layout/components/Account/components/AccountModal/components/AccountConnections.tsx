import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import Section from "components/common/Section"
import { Question } from "phosphor-react"
import platforms from "platforms/platforms"
import LinkAddressButton from "./LinkAddressButton"
import LinkedAddress from "./LinkedAddress"
import SocialAccount from "./SocialAccount"

const AccountConnections = () => {
  const { isLoading, addresses } = useUser()
  const { account } = useWeb3React()

  return (
    <Stack spacing="10" w="full">
      <Section title="Social accounts">
        {Object.entries(platforms)
          .filter(([platform]) => platform !== "POAP")
          ?.map(([key, value]: any) => (
            <SocialAccount
              key={key}
              type={key}
              icon={value.icon}
              colorScheme={value.colorScheme}
              name={value.name}
            />
          ))}
      </Section>
      <Section
        title="Linked addresses"
        titleRightElement={
          addresses?.length > 1 && (
            <Popover placement="top" trigger="hover">
              <PopoverTrigger>
                <Icon as={Question} />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  Each of your addresses will be used for requirement checks.
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )
        }
      >
        {isLoading ? (
          <Spinner />
        ) : addresses?.length === 1 && addresses?.[0] === account.toLowerCase() ? (
          <>
            <Text colorScheme={"gray"}>No linked addresses yet</Text>
            <LinkAddressButton />
          </>
        ) : (
          <Stack spacing={4} pt="2" alignItems="start" w="full">
            {addresses
              ?.filter((address) => address?.toLowerCase() !== account.toLowerCase())
              .map((address) => (
                <LinkedAddress key={address} address={address} />
              ))}
            <LinkAddressButton />
          </Stack>
        )}
      </Section>
    </Stack>
  )
}

export default AccountConnections
