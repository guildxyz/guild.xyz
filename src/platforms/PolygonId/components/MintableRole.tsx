import { Card, HStack, Heading, Spacer, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { Role } from "types"
import fetcher from "utils/fetcher"
import PolygonIdQRCode from "./PolygonIdQRCode"

type Props = {
  role: Role
}

const MintableRole = ({ role }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id: userId } = useUser()
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

  const { response, error, isLoading, onSubmit } = useSubmitWithSign(submit)

  useEffect(() => {
    if (response) setClaimed(true)
  }, [response])

  return (
    <>
      <Card p={4} mb="3" borderRadius={"2xl"}>
        <HStack spacing={4}>
          <GuildLogo imageUrl={role.imageUrl} size={"36px"} />
          <HStack spacing={1}>
            <Heading
              as="h3"
              fontSize="md"
              fontFamily="display"
              wordBreak="break-all"
              noOfLines={1}
            >
              {role.name}
            </Heading>
          </HStack>
          <Spacer />
          <Button
            colorScheme={isClaimed ? "gray" : "purple"}
            size={"sm"}
            isLoading={isLoading}
            onClick={
              isClaimed
                ? onOpen
                : () =>
                    onSubmit({
                      userId: userId,
                      data: {
                        guildId: guildId,
                        roleId: role.id,
                      },
                    })
            }
          >
            {isClaimed ? "Show QR code" : "Mint proof"}
          </Button>
        </HStack>
      </Card>
      <PolygonIdQRCode isOpen={isOpen} onClose={onClose} role={role} />
    </>
  )
}

export default MintableRole
