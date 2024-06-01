import { ThemeProvider } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/CompoundLayout"
import {
  BoundBackground,
  BoundContent,
  BoundDynamicDevTool,
  BoundHead,
  BoundHeadline,
} from "components/create-guild/BoundComponents"
import { CreateGuildProvider } from "components/create-guild/CreateGuildContext"

const CreateGuildPage = (): JSX.Element => {
  return (
    <>
      <Layout.Root>
        <Layout.Header />
        <Layout.Container>
          <BoundHead />
          <BoundBackground />
          <BoundHeadline />
          <BoundContent />
        </Layout.Container>
      </Layout.Root>
      <BoundDynamicDevTool />
    </>
  )
}

// <Layout
//   title={name || "Create Guild"}
//   backgroundOffset={47}
//   textColor={textColor}
//   background={color}
//   backgroundImage={localBackgroundImage}
//   image={
//     imageUrl && (
//       <GuildLogo
//         imageUrl={imageUrl}
//         size={{ base: "56px", lg: "72px" }}
//         mt={{ base: 1, lg: 2 }}
//         bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
//       />
//     )
//   }
//   imageUrl={imageUrl}
//   showFooter={false}
// >
//   <CreateGuildStepper
//     {...{ color, activeStep, setActiveStep, textColor, stepPart }}
//   />
//   <Stack w="full" spacing={4} pt={STEPS[activeStep].content ? 6 : 0} pb="24">
//     {STEPS[activeStep].content}
//   </Stack>
//   <GuildCreationProgress
//     next={isLastSubStep ? nextWithPostHog : () => setPart(stepPart + 1)}
//     progress={STEPS[activeStep].progress[stepPart]}
//     isDisabled={nextStepIsDisabled}
//   >
//     {stepPart === 1 ? <CreateGuildButton /> : null}
//   </GuildCreationProgress>
// </Layout>

const CreateGuildPageWrapper = (): JSX.Element => (
  <CreateGuildProvider>
    <ThemeProvider>
      <CreateGuildPage />
    </ThemeProvider>
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
