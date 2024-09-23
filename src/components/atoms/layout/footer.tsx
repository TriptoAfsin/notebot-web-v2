import { APP_CONFIG, APP_FOOTER_LINKS } from "@/config/app-config";
import Link from "next/link";
import BrandLogo from "../icons/brand-logo";
import { FacebookIcon } from "../icons/social/facebook";
import { InstagramIcon } from "../icons/social/instagram";
import { Text } from "../typography/text";
import { Title } from "../typography/title";
import { Box } from "./box";

export default function Footer() {
  return (
    <footer className="text-gray-600 body-font">
      <Box className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <Box className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <BrandLogo
            logo={APP_CONFIG.logo}
            width={300}
            className="w-36 items-center justify-center flex flex-col mx-auto lg:mx-0"
          />
          <Text className="mt-2 text-sm text-gray-500">
            {APP_CONFIG.description}
          </Text>
        </Box>
        <Box className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <Box className="lg:w-1/4 md:w-1/2 w-full px-4">
            <Title className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Quick Links
            </Title>
            <nav className="list-none mb-10">
              {APP_FOOTER_LINKS?.filter(
                item => item.category === "quick-links"
              ).map((item, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-600 hover:text-gray-800"
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </nav>
          </Box>
          <Box className="lg:w-1/4 md:w-1/2 w-full px-4">
            <Title className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Help
            </Title>
            <nav className="list-none mb-10">
              {APP_FOOTER_LINKS?.filter(item => item.category === "help").map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      className="text-gray-600 hover:text-gray-800"
                      href={item.href}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              )}
            </nav>
          </Box>
        </Box>
      </Box>
      <Box className="bg-gray-100">
        <Box className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <Text className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} {APP_CONFIG.name}
          </Text>
          <Box
            as="span"
            className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start"
          >
            <Link className="text-gray-500" href={APP_CONFIG.social.facebook}>
              <FacebookIcon />
            </Link>

            <Link className="text-gray-500" href={APP_CONFIG.social.instagram}>
              <InstagramIcon />
            </Link>
          </Box>
        </Box>
      </Box>
    </footer>
  );
}
