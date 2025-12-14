import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { APP_CONFIG, APP_HEADER_MENU } from "@/constants/app-config";
import { useFeaturedPreference } from "@/context/featured-preference";
import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";

import BrandLogo from "@/components/atoms/brand-logo";
import HeaderLinkMobile from "@/components/atoms/header-link-mobile";
import { useTheme } from "@/components/theme-provider";
import { useGetPlatformStatus } from "@/hooks/networking/content/status";
import { cn } from "@/lib/utils";
import { TextEffect } from "../typography/text-effect";
import { Box } from "./box";

const menuItems = APP_HEADER_MENU;

function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const { data: status } = useGetPlatformStatus();
  const { showFeatured, toggleFeatured } = useFeaturedPreference();

  const botStatus = status?.botStatus ? "🟢 Live" : "🔴 Down";

  const handleCloseSheet = () => setOpen(false);

  return (
    <header className="flex fixed inset-x-0 top-0 z-50 gap-4 items-center px-4 h-16 border-b bg-background md:px-6">
      <BrandLogo className="block mr-auto w-12 h-12" />
      <Box className="flex gap-4 items-center ml-auto md:ml-auto md:gap-2 lg:gap-4">
        <Box className="hidden gap-2 items-center text-sm text-muted-foreground md:flex">
          <span className="text-xs tracking-wide uppercase">Featured</span>
          <Switch
            checked={showFeatured}
            onCheckedChange={toggleFeatured}
            aria-label="Toggle featured content"
          />
        </Box>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto shrink-0">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className={cn("grid gap-6 text-lg")}>
              <BrandLogo
                className="mb-10 w-auto h-auto"
                logo={APP_CONFIG.logoIcon}
                width={92}
                height={92}
              />
              {menuItems.map(item => (
                <HeaderLinkMobile
                  key={item?.label}
                  item={item}
                  onSelect={handleCloseSheet}
                />
              ))}
            </nav>
            <Box className="flex absolute right-5 bottom-5 left-5 flex-col gap-3">
              <Box className="flex gap-2 items-center text-sm text-muted-foreground">
                <span className="text-xs tracking-wide uppercase">
                  Show Featured
                </span>
                <Switch
                  checked={showFeatured}
                  onCheckedChange={toggleFeatured}
                  aria-label="Toggle featured content"
                />
              </Box>
              <Box className="flex gap-1 justify-end items-center">
                <TextEffect>Platform Status: </TextEffect>
                {botStatus}
              </Box>
            </Box>
          </SheetContent>
        </Sheet>
      </Box>
    </header>
  );
}

export default Header;
