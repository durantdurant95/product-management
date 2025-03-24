import AddProductForm from "@/components/add-product-form";
import { ModeToggle } from "@/components/mode-toggle";
import { ListChecks } from "lucide-react";
import Link from "next/link";

type Props = {};

export default function DashboardPage({}: Props) {
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
            <AddProductForm />
            <ModeToggle />
          </div>
        </div>
      </header>
    </main>
  );
}
