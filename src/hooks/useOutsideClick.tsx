import { useEffect, useState } from "react";

const useOutsideClick = (ref: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClickOutside = (event: any) => {
    if (
      ref.current &&
      event.target &&
      !ref.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  });

  return { isOpen, openMenu, closeMenu };
};
export default useOutsideClick;
