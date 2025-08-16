import { useEffect, useState } from "react";
import { searchContainerService } from "../../../services/searchStateService";

export function useSearchState() {
  const [isOpen, setIsOpen] = useState(searchContainerService.getState());

  useEffect(() => {
    const unsubscribe = searchContainerService.subscribe(setIsOpen);
    return unsubscribe;
  }, []);

  return {
    isOpen,
    openSearch: () => searchContainerService.open(),
    closeSearch: () => searchContainerService.close(),
    toggleSearch: () => searchContainerService.toggle()
  };
}