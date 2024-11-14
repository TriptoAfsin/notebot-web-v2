import { APP_CONFIG } from "@/constants/app-config";
import { Link } from "react-router-dom";
import { Text } from "../typography/text";
import { Box } from "./box";

const PALESTINE_FLAG = "/icons/palestine-flag.png";

export default function Footer() {
  return (
    <footer className="text-gray-600 body-font dark:text-white">
      <Box className="bg-gray-100 dark:bg-zinc-800">
        <Box className="container flex flex-col flex-wrap px-5 py-4 mx-auto sm:flex-row">
          <Text className="text-sm text-center text-gray-500 dark:text-white sm:text-left">
            © {new Date().getFullYear()} {APP_CONFIG.name}
          </Text>

          <Box
            as="span"
            className="inline-flex items-center justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start"
          >
            <Box className="flex flex-col items-center sm:items-start">
              <Link to={APP_CONFIG.founder.web} target="_blank">
                <Text>Made with ❤️ by {APP_CONFIG.founder.name}</Text>
              </Link>
              <Box className="flex items-center justify-center gap-2 mt-2">
                <Text className="text-sm text-center text-gray-500 dark:text-white ">
                  Solidarity with Palestine
                </Text>
                <img
                  src={PALESTINE_FLAG}
                  alt="Palestine Flag"
                  className="w-6 h-6"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </footer>
  );
}
