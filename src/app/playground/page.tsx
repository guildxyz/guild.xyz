import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Metadata } from "next"
import { PropsWithChildren } from "react"
import { ThemeToggle } from "../../v2/components/ThemeToggle"
import { DialogExample } from "./_components/DialogExample"
import { Header } from "@/components/Header"

export const metadata: Metadata = {
  title: "Playground",
}

const Section = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-lg font-bold">{title}</h2>
    {children}
  </section>
)

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Playground</h1>
      <h1 className="text-2xl italic">Playground</h1>

      <div className="flex flex-col items-start gap-4">
        <Section title="Theme toggle">
          <ThemeToggle />
        </Section>

        <Section title="Card">
          <Card className="p-4">This is a card</Card>
        </Section>

        <Section title="Button">
          <Card className="flex gap-2 p-4">
            <Button size="xs" variant="default">
              primary (default)
            </Button>
            <Button size="xs" variant="outline">
              outline
            </Button>
            <Button size="xs" variant="ghost">
              ghost
            </Button>
            <Button size="xs" variant="accent">
              accent
            </Button>
            <Button size="xs" variant="destructive">
              destructive
            </Button>
            <Button size="xs" variant="success">
              success
            </Button>
          </Card>
          <Card className="flex gap-2 p-4">
            <Button size="sm" variant="default">
              primary (default)
            </Button>
            <Button size="sm" variant="outline">
              outline
            </Button>
            <Button size="sm" variant="ghost">
              ghost
            </Button>
            <Button size="sm" variant="accent">
              accent
            </Button>
            <Button size="sm" variant="destructive">
              destructive
            </Button>
            <Button size="sm" variant="success">
              success
            </Button>
          </Card>
          <Card className="flex gap-2 p-4">
            <Button variant="default">primary (default)</Button>
            <Button variant="outline">outline</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="accent">accent</Button>
            <Button variant="destructive">destructive</Button>
            <Button variant="success">success</Button>
          </Card>
          <Card className="flex gap-2 p-4">
            <Button size="lg" variant="default">
              primary (default)
            </Button>
            <Button size="lg" variant="outline">
              outline
            </Button>
            <Button size="lg" variant="ghost">
              ghost
            </Button>
            <Button size="lg" variant="accent">
              accent
            </Button>
            <Button size="lg" variant="destructive">
              destructive
            </Button>
            <Button size="lg" variant="success">
              success
            </Button>
          </Card>
          <Card className="flex gap-2 p-4">
            <Button size="xl" variant="default">
              primary (default)
            </Button>
            <Button size="xl" variant="outline">
              outline
            </Button>
            <Button size="xl" variant="ghost">
              ghost
            </Button>
            <Button size="xl" variant="accent">
              accent
            </Button>
            <Button size="xl" variant="destructive">
              destructive
            </Button>
            <Button size="xl" variant="success">
              success
            </Button>
          </Card>
        </Section>

        <Section title="Modal">
          <DialogExample />
        </Section>
        <Header />
      </div>
    </div>
  )
}
