import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_CONFIG, APP_HEADER_MENU } from "@/constants/app-config";
import { Menu } from "lucide-react";

import BrandLogo from "@/components/atoms/brand-logo";
import HeaderLinkMobile from "@/components/atoms/header-link-mobile";
import { cn } from "@/lib/utils";
import { Box } from "./box";

const menuItems = APP_HEADER_MENU;

function Header() {
  // const headerLoading = isLoading || isFetching || isRefetching;

  // if (headerLoading) {
  //   return <span>loading ...</span>;
  // }

  return (
    <header className="sticky top-0 z-50 flex items-center h-16 gap-4 px-4 border-b bg-background md:px-6">
      <BrandLogo className="block w-12 h-12 mr-auto" />
      <Box className="flex items-center gap-4 ml-auto md:ml-auto md:gap-2 lg:gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto shrink-0">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className={cn("grid gap-6 text-lg")}>
              <BrandLogo
                className="w-auto h-auto mb-10"
                logo={APP_CONFIG.logoIcon}
                width={92}
                height={92}
              />
              {menuItems.map(item => (
                <HeaderLinkMobile key={item?.label} item={item} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </Box>
    </header>
  );
}

export default Header;
