import type { FunctionComponent, SVGProps } from "react";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

interface IconProps {
  svg: SvgComponent;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({ svg: Svg, size = 20, color = "currentColor", strokeWidth, className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
