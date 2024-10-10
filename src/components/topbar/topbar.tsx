import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Menu, Pipette } from "lucide-react";

import Link from "next/link";
import { Badge } from "../ui/badge";

export default function Topbar() {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 z-50 md:px-6">
      <nav className="hidden flex-col justify-between text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <div className="flex items-center justify-center bg-primary h-8 w-8 rounded-sm">
            <Pipette width={16} height={16} className="text-secondary" />
          </div>
          <p className="text-base font-semibold">Pigment <span className="font-black">UI</span></p>
          <Badge variant="secondary" className="ml-1 text-[11px] font-bold px-2 py-0 h-5 rounded-sm">Beta</Badge>
        </Link>
        {/* <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Create
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Saved
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Browser
        </Link> */}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <div className="flex items-center justify-center bg-primary h-8 w-8 rounded-sm">
            <Pipette width={16} height={16} className="text-secondary" />
          </div>
          <p className="text-base font-semibold">Pigment <span className="font-black">UI</span></p>
          <Badge variant="secondary" className="ml-1 text-[11px] font-bold px-2 py-0 h-5 rounded-sm">Beta</Badge>
            </Link>
            {/* <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Create
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Saved
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Browser
            </Link> */}
          </nav>
        </SheetContent>
      </Sheet>
      {/* <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </header>
  );
}
