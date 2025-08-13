import { useEffect, useState } from "react";
import { dualCardSideService } from "../../services/dualCardSideService";

export function useDualCardSide() {
  const [showSecondSide, setShowSecondSide] = useState(dualCardSideService.getState());

  useEffect(() => {
    const unsubscribe = dualCardSideService.subscribe(setShowSecondSide);
    return unsubscribe;
  }, []);

  return {
    showSecondSide,
    toggleSide: () => dualCardSideService.toggleState(),
    setShowSecondSide: (value: boolean) => dualCardSideService.setState(value)
  };
}
