import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Collapse,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildLogo from "components/common/GuildLogo"
import useDelete from "components/[guild]/EditForm/components/DeleteCard/hooks/useDelete"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementCard from "components/[guild]/RequirementCard"
import useLevelsAccess from "components/[guild]/RolesByPlatform/components/JoinButton/hooks/useLevelsAccess"
import usePersonalSign from "hooks/usePersonalSign"
import useRequirementLabels from "hooks/useRequirementLabels"
import { useRouter } from "next/router"
import {
  CaretDown,
  CaretUp,
  Check,
  PencilSimple,
  TrashSimple,
  X,
} from "phosphor-react"
import React, { useRef, useState } from "react"
import { Role } from "types"
import AccessIndicator from "./components/AccessIndicator"

type Props = {
  roleData: Role
}

const RoleListItem = ({ roleData }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })
  const { onSubmit, isLoading: isRoleDeleteLoading } = useDelete(
    "role",
    roleData?.id
  )
  const { isSigning } = usePersonalSign()

  const { hasAccess, error, isLoading } = useLevelsAccess([roleData.id])
  const requirements = useRequirementLabels(roleData.requirements)
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={6}
      py={{ base: 5, md: 7 }}
      width="full"
    >
      <SimpleGrid
        width="full"
        templateColumns={{ base: "1fr auto", md: "auto 1fr" }}
        columnGap={{ base: 4, sm: 6 }}
        alignItems="start"
      >
        <GridItem order={{ md: 1 }}>
          <Wrap alignItems="center" spacing={2} mb={3}>
            <Heading size="md" fontFamily="display">
              {roleData.name}
            </Heading>
            <Text
              as="span"
              colorScheme="gray"
              fontSize="sm"
              position="relative"
              top={1}
            >{`${roleData.members?.length || 0} members`}</Text>
          </Wrap>

          <Wrap zIndex="1">
            {requirements?.split(", ").map((requirement) => (
              <Tag key={requirement} as="li">
                {requirement}
              </Tag>
            ))}
            <Button
              key="details"
              variant="outline"
              rightIcon={<Icon as={isRequirementsExpanded ? CaretUp : CaretDown} />}
              size="xs"
              rounded="md"
              onClick={() => setIsRequirementsExpanded(!isRequirementsExpanded)}
            >
              {isRequirementsExpanded ? "Close details" : "View details"}
            </Button>
          </Wrap>
        </GridItem>

        <GridItem order={{ md: 0 }} mt="1">
          <GuildLogo imageUrl={roleData.imageUrl} size={14} iconSize={4} />
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
          {roleData.description && <Text mt={6}>{roleData.description}</Text>}

          <Collapse in={isRequirementsExpanded} animateOpacity>
            <VStack maxW="md" mt={6}>
              {roleData.requirements?.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} boxShadow="none" />
                  {i < roleData.requirements.length - 1 && (
                    <LogicDivider logic={roleData.logic} />
                  )}
                </React.Fragment>
              ))}
            </VStack>
          </Collapse>
        </GridItem>
      </SimpleGrid>

      <HStack justifyContent="space-between">
        {!error &&
          (hasAccess ? (
            <AccessIndicator
              label="You have access"
              icon={Check}
              colorScheme="green"
            />
          ) : isLoading ? (
            <AccessIndicator label="Checking access" icon={Spinner} />
          ) : (
            <AccessIndicator label="No access" icon={X} />
          ))}

        {isOwner && (
          <>
            <Stack direction={{ base: "row", md: "column" }}>
              <IconButton
                icon={<Icon as={PencilSimple} />}
                size="sm"
                rounded="full"
                aria-label="Edit role"
                onClick={() =>
                  router.push(`/${router.query.guild}/edit/${roleData.id}`)
                }
              />
              <IconButton
                icon={<Icon as={TrashSimple} color="red.500" />}
                size="sm"
                rounded="full"
                aria-label="Delete role"
                onClick={onOpen}
              />
            </Stack>

            <AlertDialog
              motionPreset={transition}
              leastDestructiveRef={cancelRef}
              {...{ isOpen, onClose }}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Delete Role</AlertDialogHeader>
                  <AlertDialogBody>
                    <Text>Are you sure? You can't undo this action afterwards.</Text>
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      isLoading={isRoleDeleteLoading}
                      loadingText={isSigning ? "Check your wallet" : "Deleting"}
                      onClick={() => onSubmit()}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </HStack>
    </Stack>
  )
}

export default RoleListItem
