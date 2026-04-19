type IconProps = {
  size?: number;
};

export default function PaymentIcon({ size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="oi-payment-request">
        <path
          className="oi-box"
          d="M16 15H20C20.5523 15 21 14.5523 21 14V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V14C3 14.5523 3.44772 15 4 15H8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path className="oi-fill" d="M5 7.5V5H7.5L5 7.5Z" fill="currentColor" />
        <path className="oi-fill" d="M19 7.5V5H16.5L19 7.5Z" fill="currentColor" />
        <path className="oi-fill" d="M7.5 13L5 13L5 10.5L7.5 13Z" fill="currentColor" />
        <path className="oi-fill" d="M16.5 13L19 13L19 10.5L16.5 13Z" fill="currentColor" />

        <circle
          className="oi-ellipse"
          cx="12"
          cy="9"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          className="oi-line"
          d="M12 15V21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="oi-incomplete-triangle"
          d="M14 19L12 21L10 19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}