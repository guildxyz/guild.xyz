import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import useColorPalette from "hooks/useColorPalette"
import { ArrowRight } from "phosphor-react"
import { Requirement } from "types"
import { AUDITLOG } from "../../constants"
import { useAuditLogActionContext } from "../AuditLogActionContext"
import ActionIcon from "./ActionIcon"
import { AuditLogChildActionLayout } from "./AuditLogChildAction"
import UpdatedDataGrid from "./UpdatedDataGrid"

const BeforeAfterActions = (): JSX.Element => {
  const { before, data, action } = useAuditLogActionContext()

  const previousThemeProps = {
    color: before?.color,
    backgroundImage: before?.backgroundImage,
    mode: before?.mode,
  }

  const currentThemeProps = {
    color: data?.color,
    backgroundImage: data?.backgroundImage,
    mode: data?.mode,
  }

  const previousColorPalette = useColorPalette(
    "chakra-colors-primary",
    previousThemeProps.color
  )
  const currentColorPalette = useColorPalette(
    "chakra-colors-primary",
    currentThemeProps.color
  )

  if (action === AUDITLOG.UpdateRequirement)
    return (
      <AuditLogChildActionLayout
        icon={<ActionIcon action={AUDITLOG.UpdateRequirement} size={6} />}
        label="Update requirement"
      >
        <UpdatedDataGrid
          before={
            <RequirementDisplayComponent
              requirement={before as Requirement}
              rightElement={null}
            />
          }
          after={
            <RequirementDisplayComponent
              requirement={data as Requirement}
              rightElement={null}
            />
          }
        />
      </AuditLogChildActionLayout>
    )

  if (
    !before ||
    !data ||
    !Object.keys(data).some((key) => data[key] !== before[key])
  )
    return null

  return (
    <Stack py={2} spacing={4}>
      {(before.name !== data.name || before.imageUrl !== data.imageUrl) && (
        <AuditLogChildActionLayout
          icon={<ActionIcon action={AUDITLOG.UpdateLogoOrTitle} size={6} />}
          label="Update logo / title:"
        >
          <UpdatedDataGrid
            before={
              <HStack>
                <GuildLogo imageUrl={before.imageUrl} size={8} />
                <Text as="span">{before.name}</Text>
              </HStack>
            }
            after={
              <HStack>
                <GuildLogo imageUrl={data.imageUrl} size={8} />
                <Text as="span">{data.name}</Text>
              </HStack>
            }
          />
        </AuditLogChildActionLayout>
      )}

      {before.description !== data.description && (
        <AuditLogChildActionLayout
          icon={<ActionIcon action={AUDITLOG.UpdateDescription} size={6} />}
          label="Update description:"
        >
          <UpdatedDataGrid
            before={<Text>{before.description}</Text>}
            after={<Text>{data.description}</Text>}
          />
        </AuditLogChildActionLayout>
      )}

      {before.logic !== data.logic && (
        <AuditLogChildActionLayout
          icon={<ActionIcon action={AUDITLOG.UpdateLogic} size={6} />}
          label={
            <HStack fontWeight="semibold">
              <Text as="span">Update logic:</Text>

              <HStack>
                <Text as="span">{before.logic}</Text>
                <Center>
                  <Icon as={ArrowRight} boxSize={6} />
                </Center>
                <Text as="span">{data.logic}</Text>
              </HStack>
            </HStack>
          }
        />
      )}

      {before.urlName !== data.urlName && (
        <AuditLogChildActionLayout
          icon={<ActionIcon action={AUDITLOG.UpdateUrlName} size={6} />}
          label="Update URL:"
          isInline
        >
          <UpdatedDataGrid
            unstyled
            before={
              <Text
                as="span"
                color="blue.400"
                fontWeight="semibold"
              >{`guild.xyz/${before.urlName}`}</Text>
            }
            after={
              <Text
                as="span"
                color="blue.400"
                fontWeight="semibold"
              >{`guild.xyz/${data.urlName}`}</Text>
            }
          />
        </AuditLogChildActionLayout>
      )}

      {Object.values(previousThemeProps).every(Boolean) &&
        Object.keys(previousThemeProps).some(
          (key) => previousThemeProps[key] !== currentThemeProps[key]
        ) && (
          <AuditLogChildActionLayout
            icon={<ActionIcon action={AUDITLOG.UpdateTheme} size={6} />}
            label="Update theme:"
          >
            <UpdatedDataGrid
              boxPadding={0}
              before={
                <Flex
                  sx={{
                    ...previousColorPalette,
                  }}
                >
                  <Box
                    bgColor="primary.500"
                    bgImage={previousThemeProps.backgroundImage}
                    bgSize="cover"
                    flexGrow={1}
                  />
                  <Center px={4} py={6}>
                    <Button colorScheme="primary" size="sm" borderRadius="md">
                      Button
                    </Button>
                  </Center>
                </Flex>
              }
              after={
                <Flex
                  sx={{
                    ...currentColorPalette,
                  }}
                >
                  <Box
                    bgColor="primary.500"
                    bgImage={previousThemeProps.backgroundImage}
                    bgSize="cover"
                    flexGrow={1}
                  />
                  <Center px={4} py={6}>
                    <Button colorScheme="primary" size="sm" borderRadius="md">
                      Button
                    </Button>
                  </Center>
                </Flex>
              }
            />
          </AuditLogChildActionLayout>
        )}
    </Stack>
  )
}

export default BeforeAfterActions
