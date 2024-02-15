import { ThemeVariants } from "@/utils/constants";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const DynamicClipLoader = dynamic(() => import("react-spinners/ClipLoader"), {
  ssr: false,
});

const Loader = ({ size = 100 }: { size?: number }) => {
  const { theme } = useTheme();

  const darkMode = theme === ThemeVariants.dark;
  const loaderColor = darkMode ? "#fff" : "#000";

  return (
    <DynamicClipLoader
      color={loaderColor}
      loading
      cssOverride={{
        display: "block",
        margin: "0 auto",
      }}
      size={size}
    />
  );
};

export default Loader;
