import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Ensure every route change starts at the top of the page.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
