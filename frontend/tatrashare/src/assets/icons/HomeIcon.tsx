type IconProps = {
  size?: number;
};

export default function HomeIcon({ size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="oi-home">
        <path
          className="oi-vector"
          d="M5 9.5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="oi-box"
          d="M14 15H10V21H14V15Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="oi-incomplete-triangle"
          d="M3 11L12 3L21 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}