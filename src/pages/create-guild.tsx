import {
  Center,
  Collapse,
  Icon,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import {
  CreateGuildProvider,
  useCreateGuildContext,
} from "components/create-guild/CreateGuildContext"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { CaretDown } from "phosphor-react"
import React from "react"
import { useFormContext } from "react-hook-form"

const CreateGuildPage = (): JSX.Element => {
  const { steps, activeStep } = useCreateGuildContext()
  const { control } = useFormContext()

  const { isOpen, onToggle } = useDisclosure()

  const bannerColor = useColorModeValue(
    "var(--chakra-colors-gray-800)",
    "whiteAlpha.200"
  )
  const cardBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const borderColor = useColorModeValue("gray.500", "gray.200")

  const orientation = useBreakpointValue<any>({ base: "vertical", md: "horizontal" })
  const WrapperComponent = useBreakpointValue<any>({
    base: Collapse,
    md: React.Fragment,
  })

  return (
    <>
      <Layout
        title="Create Guild"
        background={bannerColor}
        backgroundProps={{ opacity: 1 }}
        backgroundOffset={47}
        textColor="white"
      >
        <Card
          pos="relative"
          py="6"
          px={{ base: 5, md: 6 }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bg: cardBgColor,
          }}
          onClick={onToggle}
          borderWidth="2px"
          borderColor={borderColor}
        >
          <Stepper
            index={activeStep}
            colorScheme="gray"
            orientation={orientation}
            gap={{ base: 0, md: 4 }}
            w="full"
          >
            {steps.map((step, index) => (
              <WrapperComponent
                key={index}
                in={activeStep === index || isOpen}
                style={{ width: "100%" }}
              >
                <Step
                  {...{
                    alignItems: activeStep === index && !isOpen && "center",
                    gap: 3,
                    paddingBottom: {
                      base: index !== steps.length - 1 && isOpen && 4,
                      md: 0,
                    },
                    transition: "padding .2s",
                  }}
                >
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Stack
                    justifyContent={"center"}
                    spacing="0"
                    w={{ base: "full", md: "auto" }}
                  >
                    <StepTitle>{step.title}</StepTitle>
                    {step.label && <StepDescription>{step.label}</StepDescription>}
                  </Stack>
                  {activeStep === index && (
                    <Center>
                      <Icon
                        display={{ md: "none" }}
                        as={CaretDown}
                        boxSize={4}
                        transform={isOpen && "rotate(-180deg)"}
                        transition="transform .3s"
                      />
                    </Center>
                  )}
                  <StepSeparator
                    {...({
                      minWidth: { md: "4" },
                      opacity: { base: !isOpen && "0", md: "1" },
                    } as any)}
                  />
                </Step>
              </WrapperComponent>
            ))}
          </Stepper>
        </Card>
        <Stack w="full" spacing={{ base: 4, md: 4 }} pt="6">
          {steps[activeStep].content}
        </Stack>
      </Layout>
      <DynamicDevTool control={control} />
    </>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <CreateGuildProvider>
    <CreateGuildPage />
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
