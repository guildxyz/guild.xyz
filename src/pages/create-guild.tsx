import {
  Center,
  Collapse,
  Icon,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
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
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { steps, activeStep, setActiveStep } = useCreateGuildContext()
  const { control, getValues } = useFormContext()

  const { isOpen, onToggle } = useDisclosure()

  const bannerColor = useColorModeValue("gray.200", "gray.700")
  const cardBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const orientation = useBreakpointValue<any>({ base: "vertical", md: "horizontal" })
  const WrapperComponent = useBreakpointValue<any>({
    base: Collapse,
    md: React.Fragment,
  })

  const color =
    localThemeColor !== getValues("theme.color")
      ? getValues("theme.color")
      : localThemeColor

  const imageUrl = getValues("imageUrl")

  return (
    <>
      <Layout
        title={getValues("name") ? getValues("name") : "Create Guild"}
        backgroundOffset={47}
        textColor={textColor}
        background={color}
        backgroundImage={localBackgroundImage}
        image={
          imageUrl && (
            <GuildLogo
              imageUrl={imageUrl}
              size={{ base: "56px", lg: "72px" }}
              mt={{ base: 1, lg: 2 }}
              bgColor={"primary.800"}
            />
          )
        }
        imageUrl={imageUrl}
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
          borderColor={color}
        >
          <Stepper
            index={activeStep}
            orientation={orientation}
            gap={{ base: 0, md: 4 }}
            w="full"
            size={"sm"}
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
                  }}
                >
                  <StepIndicator
                    {...{
                      bg: activeStep > index ? `${color} !important` : bannerColor,
                      borderColor:
                        activeStep === index ? `${color} !important` : "none",
                      cursor: activeStep > index ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (activeStep > index) setActiveStep(index)
                    }}
                  >
                    <StepStatus
                      complete={<StepIcon color={textColor} />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Stack
                    justifyContent={"center"}
                    spacing="0"
                    w={{ base: "full", md: "auto" }}
                    position={"relative"}
                  >
                    <StepTitle as={"p"} style={{ fontSize: "xs" }}>
                      {step.title}
                    </StepTitle>
                    {activeStep === index && (
                      <Text colorScheme="gray" fontSize="sm" left={0} bottom={-5}>
                        {step.description}
                      </Text>
                    )}
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
                </Step>
                <StepSeparator
                  {...({
                    minWidth: { md: "4" },
                    position: "relative !important",
                    top: "unset !important",
                    left: "unset !important",
                    marginLeft: 4,
                    minHeight: { base: 4, md: "2px" },
                    height: { base: "4 !important", md: "2px !important" },
                  } as any)}
                />
              </WrapperComponent>
            ))}
          </Stepper>
          {steps[activeStep].label && (
            <Text pt={7} position={"relative"}>
              {steps[activeStep].label}
            </Text>
          )}
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
    <ThemeProvider>
      <CreateGuildPage />
    </ThemeProvider>
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
