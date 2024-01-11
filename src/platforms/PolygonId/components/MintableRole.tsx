import {
  Card,
  HStack,
  Heading,
  Spacer,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { Role } from "types"
import fetcher from "utils/fetcher"
import PolygonIDQRCodeModal from "./PolygonIDQRCodeModal"

type Props = {
  role: Role
}

const MintableRole = ({ role }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showErrorToast = useShowErrorToast()
  const { id: userId } = useUser()
  const { hasAccess } = useAccess(role.id)
  const { id: guildId } = useGuild()
  const claimedRoles = useSWRImmutable(
    `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/claims?format=role&guildId=${guildId}`
  )
  const [isClaimed, setClaimed] = useState(
    claimedRoles.data?.length &&
      !!claimedRoles.data[0].roleIds.find(
        (claimedRoleId) => claimedRoleId === role.id
      )
  )

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/polygon-id/claim`, {
      method: "POST",
      ...signedValidation,
    })

  const joinFetcher = (signedValidation: SignedValdation) =>
    fetcher(`/user/join`, signedValidation)

  const { response, isLoading, onSubmit } = useSubmitWithSign(submit)

  useEffect(() => {
    if (response) setClaimed(true)
  }, [response])

  const join = useSubmitWithSign(joinFetcher, {
    onSuccess: () =>
      onSubmit({
        userId: userId,
        data: {
          guildId: guildId,
          roleId: role.id,
        },
      }),
    onError: (err) =>
      showErrorToast({
        error: "Couldn't check eligibility",
        correlationId: err.correlationId,
      }),
  })

  return (
    <Card p={4} mb="3" borderRadius={"2xl"}>
      <HStack spacing={4}>
        <GuildLogo imageUrl={role.imageUrl} size={12} />
        <Heading
          as="h3"
          fontSize="lg"
          fontFamily="display"
          wordBreak="break-all"
          noOfLines={1}
        >
          {role.name}
        </Heading>
        <Spacer />
        <Tooltip
          label="You don't satisfy the requirements to this role"
          isDisabled={hasAccess}
          placement="top"
          hasArrow
        >
          <Button
            colorScheme={isClaimed ? "gray" : "purple"}
            h={10}
            isLoading={isLoading || join.isLoading}
            isDisabled={!hasAccess}
            onClick={() => {
              onOpen()
              if (!isClaimed) join.onSubmit({ guildId })
            }}
          >
            {isClaimed ? "Show QR code" : "Mint proof"}
          </Button>
        </Tooltip>
      </HStack>

      <PolygonIDQRCodeModal isOpen={isOpen} onClose={onClose} role={role} />
    </Card>
  )
}

export default MintableRole
