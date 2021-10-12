import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Icon,
  Stack,
  Tag,
  TagLabel,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import SearchBar from "components/index/SearchBar"
import { motion } from "framer-motion"
import { Check } from "phosphor-react"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const CreateGroupPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })

  const [searchInput, setSearchInput] = useState("")

  // TEMP
  const [isSelected, setIsSelected] = useState(false)

  return (
    <FormProvider {...methods}>
      <Layout title="Create Group">
        {account ? (
          <>
            <Box mb={16}>
              <SearchBar
                placeholder="Search guilds"
                setSearchInput={setSearchInput}
              />
            </Box>
            <Stack spacing={12}>
              <CategorySection
                title="Guilds"
                fallbackText={`No results for ${searchInput}`}
              >
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Card
                    onClick={() => setIsSelected(!isSelected)}
                    role="group"
                    position="relative"
                    px={{ base: 5, sm: 7 }}
                    py="7"
                    w="full"
                    h="full"
                    bg="gray.700"
                    borderWidth={3}
                    borderColor={isSelected ? "green.400" : "transparent"}
                    justifyContent="center"
                    cursor="pointer"
                    _before={{
                      content: `""`,
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bg: "primary.300",
                      borderRadius: "xl",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                    _hover={{
                      _before: {
                        opacity: 0.1,
                      },
                    }}
                    _active={{
                      _before: {
                        opacity: 0.17,
                      },
                    }}
                  >
                    <VStack spacing={3} alignItems="start">
                      <Text
                        fontFamily="display"
                        fontSize="xl"
                        fontWeight="bold"
                        letterSpacing="wide"
                      >
                        Random guild
                      </Text>
                      <Wrap>
                        <Tag as="li">
                          <TagLabel>Tag #1</TagLabel>
                        </Tag>
                        <Tag as="li">
                          <TagLabel>Tag #2</TagLabel>
                        </Tag>
                      </Wrap>
                    </VStack>

                    <Flex
                      position="absolute"
                      top={2}
                      right={2}
                      boxSize={6}
                      alignItems="center"
                      justifyContent="center"
                      borderColor="whiteAlpha.300"
                      borderWidth={isSelected ? 0 : 3}
                      bgColor={isSelected ? "green.400" : "transparent"}
                      color="white"
                      rounded="full"
                    >
                      {isSelected && <Icon as={Check} />}
                    </Flex>
                  </Card>
                </motion.div>
              </CategorySection>
            </Stack>
          </>
        ) : (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1}>
                Please connect your wallet in order to continue!
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </FormProvider>
  )
}

export default CreateGroupPage
