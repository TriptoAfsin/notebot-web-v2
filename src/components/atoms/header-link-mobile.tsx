import { Box } from "@/components/atoms/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

function HeaderLinkMobile({
  item,
  onSelect,
}: {
  item: Record<string, any>;
  onSelect: () => void;
}) {
  const location = useLocation();
  const fullPath = location.pathname + location.search;

  if (item.children) {
    return (
      <Box key={item.label} className="space-y-2">
        <Accordion type="single" collapsible key={item.label}>
          <AccordionItem
            value={`item-${item.label}`}
            className="border-none shadow-none"
          >
            <AccordionTrigger className="w-full font-normal">
              <Box>{item.label}</Box>
            </AccordionTrigger>
            <AccordionContent>
              {item.children.map((child: Record<string, any>) => (
                <Link
                  key={child.name}
                  to={child.href}
                  className={cn(
                    "block py-3 pl-2 hover:bg-accent",
                    fullPath === child.href ? "font-semibold" : ""
                  )}
                >
                  {child.name}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Box>
    );
  }
  return (
    <Link
      key={item.label}
      to={item.href}
      onClick={onSelect}
      className={cn(
        "py-2 hover:bg-accent flex items-center gap-2",
        fullPath === item.href ? "font-semibold" : ""
      )}
      target={item.isExternal ? "_blank" : "_self"}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export default HeaderLinkMobile;
