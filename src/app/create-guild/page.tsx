import { AuthBoundary } from "@/components/AuthBoundary";
import { ConfettiProvider } from "@/components/ConfettiProvider";
import { SignInButton } from "@/components/SignInButton";
import { Card } from "@/components/ui/Card";
import { CreateGuildButton } from "./components/CreateGuildButton";
import { CreateGuildForm } from "./components/CreateGuildForm";
import { CreateGuildFormProvider } from "./components/CreateGuildFormProvider";

export const metadata = {
  title: "Begin your guild",
};

const CreateGuild = () => (
  <main className="container mx-auto grid max-w-lg gap-8 px-4 py-8">
    {/* TODO: make a common layout component & use it here too */}
    <CreateGuildFormProvider>
      <ConfettiProvider>
        <Card className="flex flex-col px-5 py-6 shadow-lg md:px-6">
          <h2 className="mb-7 text-center font-display font-extrabold text-2xl">
            Begin your guild
          </h2>

          {/* TODO: <CreateGuildImageUploader /> */}

          <div className="mb-8 flex flex-col gap-4">
            <CreateGuildForm />
          </div>

          <AuthBoundary fallback={<SignInButton size="xl" />}>
            <CreateGuildButton />
          </AuthBoundary>
        </Card>
      </ConfettiProvider>
    </CreateGuildFormProvider>
  </main>
);

export default CreateGuild;
