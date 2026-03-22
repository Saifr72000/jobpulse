import { ClipLoader } from "react-spinners";
import "./Loader.scss";

// Matches $violet from _variables.scss
const SPINNER_COLOR = "#7151e6";

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
}

export function Loader({ fullScreen = false, size = 40 }: LoaderProps) {
  return (
    <div className={`loader-wrap${fullScreen ? " loader-wrap--fullscreen" : ""}`}>
      <ClipLoader
        color={SPINNER_COLOR}
        size={size}
        aria-label="Loading"
        data-testid="loader"
      />
    </div>
  );
}
