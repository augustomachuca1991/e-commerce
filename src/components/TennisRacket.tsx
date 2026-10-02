import type { SVGProps } from 'react';

interface TennisRacketProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

export function TennisRacket({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: TennisRacketProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="rotate(-45 12 12)">
        <ellipse cx="12" cy="9" rx="5" ry="7" />
        <path d="M12 2v14" />
        <path d="M7 9h10" />
        <path d="M12 16v6" />
      </g>
    </svg>
  );
}
