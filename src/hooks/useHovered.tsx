import { useState } from "react";

function useHover() {
  const [hovered, setHovered] = useState(false);

  const handleMouseIn = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  return {
    hovered,
    handleMouseIn,
    handleMouseOut,
  };
}

export default useHover;
