import { HandHeart, House, MessageCircle, Phone } from "lucide-react";

export const APP_CONFIG = {
  name: "NoteBot Web",
  logoIcon: "/notebot-web.png",
  colorPrimary: "#377fcc",
  colorSecondary: "#000000",
  appLink: "https://play.google.com/store/apps/details?id=com.hawkers.notebot",
  botLink: "https://www.messenger.com/t/103148557940299",
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
    id: 12121,
    icon: <MessageCircle size={20} strokeWidth={1.5} />,
    label: "NoteBot App",
    href: APP_CONFIG.appLink,
    isExternal: true,
  },
  {
    id: 1,
    icon: <MessageCircle size={20} strokeWidth={1.5} />,
    label: "NoteBot Messenger",
    href: APP_CONFIG.botLink,
    isExternal: true,
  },
  {
    id: 2,
    icon: <Phone size={20} strokeWidth={1.5} />,
    label: "BUTEX PhoneBook",
    href: "https://triptoafsin.github.io/butex-phonebook-v2/",
    isExternal: true,
  },
  {
    id: 3,
    icon: <HandHeart size={20} strokeWidth={1.5} />,
    label: "Submit Notes",
    href: "https://forms.gle/RjPXedjRDim4YE6P8",
    isExternal: true,
  },
];
