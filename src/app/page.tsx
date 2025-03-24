import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ListChecks, Plus } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto py-4 lg:py-8 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ProductTracker</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/products">
              <Button variant="outline">Get started</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Track Your Products{" "}
            <span className="text-primary">Effortlessly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A simple way to manage your product inventory and track what has
            been checked and what needs attention.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Easy Product Management
              </h3>
              <p className="text-muted-foreground">
                Quickly add new products with a simple form and manage your
                inventory with ease.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Track Product Status</h3>
              <p className="text-muted-foreground">
                Mark products as checked or unchecked and easily filter between
                different statuses.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ListChecks className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Organized Interface</h3>
              <p className="text-muted-foreground">
                Clean, intuitive interface with separate tabs for checked and
                unchecked products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/30 text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of users who are already managing their products more
            efficiently.
          </p>
          <Link href="/products">
            <Button size="lg">
              Try ProductTracker Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ListChecks className="h-5 w-5 text-primary" />
              <span className="font-bold">ProductTracker</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ProductTracker
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
