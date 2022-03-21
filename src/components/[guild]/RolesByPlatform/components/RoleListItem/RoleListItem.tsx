import {
  Collapse,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementCard from "components/[guild]/RequirementCard"
import useRequirementLabels from "components/[guild]/RolesByPlatform/components/RoleListItem/hooks/useRequirementLabels"
import dynamic from "next/dynamic"
import { CaretDown, CaretUp } from "phosphor-react"
import React, { useState } from "react"
import { Role } from "types"
import AccessIndicator from "./components/AccessIndicator"

type Props = {
  roleData: Role
  isInitiallyExpanded?: boolean
}

const DynamicEditRole = dynamic(() => import("./components/EditRole"), {
  ssr: false,
})

const RoleListItem = ({
  roleData,
  isInitiallyExpanded = false,
}: Props): JSX.Element => {
  const { isAdmin } = useGuildPermission()

  const requirements = useRequirementLabels(roleData.requirements)
  const [isRequirementsExpanded, setIsRequirementsExpanded] =
    useState(isInitiallyExpanded)

  return (
    <SimpleGrid
      width="full"
      templateColumns={{ base: "1fr auto", md: "auto 1fr auto" }}
      columnGap={{ base: 4, sm: 6 }}
      py={{ base: 5, md: 7 }}
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
          >{`${roleData.memberCount} member${
            roleData.memberCount > 1 ? "s" : ""
          }`}</Text>
        </Wrap>

        <Wrap zIndex="1">
          {requirements?.map((requirement) => (
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
        <GuildLogo imageUrl={roleData.imageUrl} size={54} iconSize={16} />
      </GridItem>

      <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={{ md: 3 }}>
        {roleData.description && <Text mt={6}>{roleData.description}</Text>}
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={{ md: 4 }}>
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

      <GridItem
        pt={{ base: "6", md: "unset" }}
        order={{ md: 2 }}
        rowSpan={{ md: 2 }}
        colSpan={{ base: 2, md: "auto" }}
        alignSelf="stretch"
      >
        <HStack justifyContent="space-between" h="full">
          <AccessIndicator roleId={roleData.id} />
          {isAdmin && <DynamicEditRole roleData={roleData} />}
        </HStack>
      </GridItem>
    </SimpleGrid>
  )
}

export default RoleListItem
