import {
  HStack,
  Icon,
  Stack,
  Tag,
  TagLabel,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Checks, Users } from "phosphor-react"
import { Visibility } from "types"
import RoleTag from "../RoleTag"
import useGuild from "../hooks/useGuild"

const DISPLAYED_ROLES_COUNT = 3

const Message = () => {
  // Using this as mock data
  const { roles } = useGuild()

  const isMobile = useBreakpointValue({ base: true, md: false })
  const moreRolesTagBorderColorVar = useColorModeValue("gray-300", "whiteAlpha-300")
  const moreRolesCount = roles.length - DISPLAYED_ROLES_COUNT

  return (
    <>
      <Card p={6}>
        <Stack spacing={4} w="full">
          <Stack spacing={2} w="full">
            <Text as="span" fontWeight="bold" colorScheme="gray" fontSize="sm">
              2023.10.21 18:00
            </Text>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has...
            </Text>
          </Stack>

          <HStack justifyContent="space-between">
            <HStack>
              <Text as="span" colorScheme="gray">
                to:
              </Text>

              {isMobile ? (
                <Tag
                  as="button"
                  variant="outline"
                  color="var(--chakra-colors-chakra-body-text)"
                  w="max-content"
                  sx={{
                    "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
                  }}
                >
                  <TagLabel>{`${roles.length} roles`}</TagLabel>
                </Tag>
              ) : (
                <>
                  {roles.slice(0, DISPLAYED_ROLES_COUNT)?.map((role) => (
                    <RoleTag
                      key={role.id}
                      name={role.name}
                      imageUrl={role.imageUrl}
                      isHidden={role.visibility === Visibility.HIDDEN}
                    />
                  ))}
                  {moreRolesCount > 0 && (
                    <Tag
                      as="button"
                      variant="outline"
                      color="var(--chakra-colors-chakra-body-text)"
                      w="max-content"
                      sx={{
                        "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
                      }}
                    >
                      <TagLabel>{`+ ${moreRolesCount} more`}</TagLabel>
                    </Tag>
                  )}
                </>
              )}
            </HStack>

            <HStack>
              <Icon as={Checks} color="gray.400" />
              <Text as="span" colorScheme="gray" fontSize="sm">
                <Text as="b">42</Text>
                /56
              </Text>
              <Icon as={Users} color="gray.400" />
            </HStack>
          </HStack>
        </Stack>
      </Card>

      {/* TODO: modal */}
    </>
  )
}

export default Message
