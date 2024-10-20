import { HandHeart, House, MessageCircle, Phone } from "lucide-react";

export const APP_CONFIG = {
  name: "NoteBot Web",
  logoIcon: "/notebot-web.png",
  founder: {
    name: "Afshin Nahian Tripto",
    github: "https://github.com/TriptoAfsin",
    web: "https://www.triptex.me/",
  },
};

export const APP_HEADER_MENU = [
  {
    id: 0,
    icon: <House size={20} strokeWidth={1.5} />,
    label: "Home",
    href: "/",
  },
  {
    id: 1,
    icon: <MessageCircle size={20} strokeWidth={1.5} />,
    label: "NoteBot Messenger",
    href: "/",
  },
  {
    id: 2,
    icon: <Phone size={20} strokeWidth={1.5} />,
    label: "BUTEX PhoneBook",
    href: "/",
  },
  {
    id: 3,
    icon: <HandHeart size={20} strokeWidth={1.5} />,
    label: "Submit Notes",
    href: "/",
  },
];
