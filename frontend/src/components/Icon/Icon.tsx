import type { FunctionComponent, SVGProps } from "react";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

interface IconProps {
  svg: SvgComponent;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({ svg: Svg, size = 20, color = "currentColor", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      color={color}
      className={className}
      aria-hidden="true"
    />
  );
}
