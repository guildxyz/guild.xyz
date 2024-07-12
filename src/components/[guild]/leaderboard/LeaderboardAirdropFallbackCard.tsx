import { Center, Collapse, Img, useColorModeValue } from "@chakra-ui/react"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import ActionCard from "components/common/ActionCard"
import Button from "components/common/Button"
import { LinkButton } from "components/common/LinkMenuItem"
import useToast from "hooks/useToast"
import { atom, useAtom, useSetAtom } from "jotai"
import { SignIn, X } from "phosphor-react"
import { useAccount } from "wagmi"
import useMembershipUpdate from "../JoinModal/hooks/useMembershipUpdate"
import useGuild from "../hooks/useGuild"

const isHiddenAtom = atom(false)
const isFinishedAtom = atom(false)

const LeaderboardAirdropFallbackCard = ({ guildPlatform }) => {
  const [isHidden, setIsHidden] = useAtom(isHiddenAtom)
  const [isFinished, setIsFinished] = useAtom(isFinishedAtom)
  const { isConnected } = useAccount()
  const { urlName, roles } = useGuild()
  const toast = useToast()
  const { triggerMembershipUpdate, isLoading } = useMembershipUpdate({
    onSuccess: () => {
      toast({ status: "success", title: "Successfully checked eligiblity" })
      setIsFinished(true)
    },
  })
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const viewRoleColor = useColorModeValue("GrayText", "gray.400")

  const relevantRole = roles?.find((role) =>
    role.rolePlatforms.find((rp) => rp.guildPlatformId === guildPlatform.id)
  )

  if (isFinished)
    return (
      <Collapse in={!isHidden} style={{ padding: "5px", margin: "-5px" }}>
        <ActionCard
          image={
            <Center
              flexShrink={0}
              bg="blackAlpha.200"
              borderRadius="full"
              boxSize="8"
            >
              <X />
            </Center>
          }
          title={`You're not eligible to claim ${guildPlatform.platformGuildData.name}`}
          description={
            <>
              {`Only addresses included in snapshot are eligible. `}
              <LinkButton
                variant="link"
                href={`/${urlName}#role-${relevantRole.id}`}
                color={viewRoleColor}
              >
                View role
              </LinkButton>
            </>
          }
          action={
            <Button
              w={{ base: "full", sm: "auto" }}
              flexShrink="0"
              variant="outline"
              onClick={() => setIsHidden(true)}
            >
              Hide
            </Button>
          }
        />
      </Collapse>
    )

  return (
    <ActionCard
      image={
        <Img
          src={guildPlatform.platformGuildData.imageUrl}
          borderRadius="full"
          boxSize="8"
        />
      }
      title={`You might be eligible to claim some ${guildPlatform.platformGuildData.name} for your points`}
      action={
        isConnected ? (
          <Button
            w={{ base: "full", sm: "auto" }}
            flexShrink="0"
            colorScheme="primary"
            onClick={() => triggerMembershipUpdate()}
            isLoading={isLoading}
            loadingText="Checking eligibility"
          >
            Check eligibility
          </Button>
        ) : (
          <Button
            w={{ base: "full", sm: "auto" }}
            flexShrink="0"
            colorScheme="indigo"
            leftIcon={<SignIn />}
            onClick={() => setIsWalletSelectorModalOpen(true)}
          >
            Sign in
          </Button>
        )
      }
    />
  )
}

export default LeaderboardAirdropFallbackCard
