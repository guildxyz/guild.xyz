import { AuthBoundary } from "@/components/AuthBoundary";
import { ConfettiProvider } from "@/components/ConfettiProvider";
import { SignInButton } from "@/components/SignInButton";
import { Card } from "@/components/ui/Card";
import svgToTinyDataUri from "mini-svg-data-uri";
import { CreateGuildButton } from "./components/CreateGuildButton";
import { CreateGuildForm } from "./components/CreateGuildForm";
import { CreateGuildFormProvider } from "./components/CreateGuildFormProvider";

export const metadata = {
  title: "Begin your guild",
};

const CreateGuild = () => (
  <main className="container mx-auto grid max-w-lg gap-8 py-16">
    <div
      className="-z-10 absolute inset-0 opacity-40 dark:opacity-60"
      style={{
        background: `radial-gradient(ellipse at center, transparent -250%, var(--background) 80%), url("${svgToTinyDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#666"><path d="M0 .5H31.5V32"/></svg>`,
        )}")`,
      }}
    />

    <CreateGuildFormProvider>
      <ConfettiProvider>
        <Card className="flex flex-col px-5 py-6 shadow-lg md:px-6">
          <h2 className="mb-7 text-center font-display font-extrabold text-2xl">
            Begin your guild
          </h2>

          <div className="mb-8 flex flex-col gap-4">
            <CreateGuildForm />
          </div>

          <AuthBoundary
            fallback={<SignInButton size="xl" colorScheme="primary" />}
          >
            <CreateGuildButton />
          </AuthBoundary>
        </Card>
      </ConfettiProvider>
    </CreateGuildFormProvider>
  </main>
);

export default CreateGuild;
