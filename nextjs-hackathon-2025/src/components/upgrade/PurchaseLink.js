import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { useEffect, useRef } from "react";

const PurchaseLink = ({
  href,
  className = "",
  children = "Purchase",
  theme = "light",
}) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      PolarEmbedCheckout.init();
      initialized.current = true;
    }

    return () => {
      // Cleanup function
      if (initialized.current) {
        try {
          const modal = document.querySelector("[data-polar-checkout-modal]");
          if (modal) {
            modal.remove();
          }
        } catch (error) {
          console.error("Error cleaning up Polar checkout:", error);
        }
      }
    };
  }, []);

  // Ensure href is a valid Polar checkout URL
  const getValidUrl = (productId) => {
    if (!productId) return "#";
    if (productId.startsWith("http")) return productId;
    return `https://polar.sh/checkout/${productId}`;
  };

  return (
    <a
      href={getValidUrl(href)}
      data-polar-checkout
      data-polar-checkout-theme={theme}
      className={className}
    >
      {children}
    </a>
  );
};

export default PurchaseLink;
