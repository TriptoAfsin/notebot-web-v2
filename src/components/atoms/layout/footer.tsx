import { APP_CONFIG } from "@/constants/app-config";
import { Link } from "react-router-dom";
import { Text } from "../typography/text";
import { Box } from "./box";

export default function Footer() {
  return (
    <footer className="text-gray-600 body-font">
      <Box className="bg-gray-100">
        <Box className="container flex flex-col flex-wrap px-5 py-4 mx-auto sm:flex-row">
          <Text className="text-sm text-center text-gray-500 sm:text-left">
            © {new Date().getFullYear()} {APP_CONFIG.name}
          </Text>
          <Box
            as="span"
            className="inline-flex items-center justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start"
          >
            <Link to={APP_CONFIG.founder.web} target="_blank">
              <Text>Made with ❤️ by {APP_CONFIG.founder.name}</Text>
            </Link>
          </Box>
        </Box>
      </Box>
    </footer>
  );
}
