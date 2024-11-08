"use client";

import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import logoPigmentUI from "@/public/images/logo.svg";
import { Menu } from "lucide-react";

import { usePathname } from "next/navigation"; // Importação do usePathname

// Array de itens de navegação (podem vir de props ou de uma API)
const navItems = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "Explore", href: "/explore" },
  { label: "API", href: "/API" },
];

export default function Navbar() {
  const pathname = usePathname(); // Obtém o caminho atual usando usePathname

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:px-8">
      {/* Navbar Desktop */}
      <nav className="hidden container p-0 flex-col gap-6 text-lg font-medium max-w-7xl md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Image src={logoPigmentUI} alt="logo" width={150} />

        {/* Renderizando links de navegação dinamicamente */}
        {navItems.map((item) => {
          // Verifica se o link está na rota atual
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                isActive ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Navbar Mobile */}
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
              <Image src={logoPigmentUI} alt="logo" width={150} />
              <span className="sr-only">Acme Inc</span>
            </Link>

            {/* Renderizando links de navegação dinamicamente para mobile */}
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
