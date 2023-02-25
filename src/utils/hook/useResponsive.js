import { useMediaQuery } from "react-responsive";

const useResponsive = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minDeviceWidth: 1224,
  });

  return { isDesktopOrLaptop };
};

export default useResponsive;
