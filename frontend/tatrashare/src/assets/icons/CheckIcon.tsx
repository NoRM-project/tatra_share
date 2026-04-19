type IconProps = {
  size?: number;
  className: string;
};

export default function CheckIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="oi-check">
        <path
          className="oi-vector"
          d="M4 12L9.33333 18L20 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}