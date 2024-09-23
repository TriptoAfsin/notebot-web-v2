"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_CONFIG, APP_HEADER_MENU } from "@/config/app-config";
import { CircleUser, Menu } from "lucide-react";
import Link from "next/link";

import LogoutButton from "@/components/atoms/buttons/logout-button";
import HeadLink from "@/components/atoms/header-links";
import BrandLogo from "@/components/atoms/icons/brand-logo";
import { APP_PATHS } from "@/config/path-config";
import { useGetCurrentUser } from "@/hooks/networking/useGetCurrentUser";
import { cn } from "@/lib/utils";
import HeaderLinkMobile from "../header-link-mobile";
import { Box } from "./box";

const menuItems = APP_HEADER_MENU;

function Header() {
  const { data, isLoading, isFetching, isRefetching, refetch } =
    useGetCurrentUser();

  const isLoggedIn = data?.isLoggedIn ? true : false;
  const role = data?.role;

  // const headerLoading = isLoading || isFetching || isRefetching;

  const filterMenuItems = (items: Record<string, any>[]) => {
    return items.filter(item => {
      if (!item) return null;
      if (item?.roles && !item?.roles?.includes(role as string)) return null;
      if (item?.authenticated && !isLoggedIn) return null;
      return item;
    });
  };

  // if (headerLoading) {
  //   return <span>loading ...</span>;
  // }

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Box className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <BrandLogo className="h-10 w-10" />
          <span className="sr-only">{APP_CONFIG.name}</span>
        </Box>
        {filterMenuItems(menuItems).map(item => (
          <HeadLink data={item} key={item.name} />
        ))}
      </nav>
      <BrandLogo className="h-10 w-10 mr-auto block md:hidden" />
      <Box className="flex ml-auto items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full ml-auto text-white"
              >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={APP_PATHS.PROFILE.ROOT}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
              </Link>
              <DropdownMenuSeparator />
              <LogoutButton refetch={refetch} />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={"/login"} className="ml-auto">
            <Button variant="secondary" className="text-white">
              Login
            </Button>
          </Link>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden ml-auto"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className={cn("grid gap-6 text-lg")}>
              <BrandLogo
                className="h-10 w-auto mb-10"
                logo={APP_CONFIG.logo}
                width={164}
                height={164}
              />
              {filterMenuItems(menuItems).map(item => (
                <HeaderLinkMobile key={item?.name} item={item} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </Box>
    </header>
  );
}

export default Header;
