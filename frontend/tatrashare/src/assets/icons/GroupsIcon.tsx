type IconProps = {
  size?: number;
};

export default function GroupsIcon({ size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="oi-users">
        <path
          className="oi-vector"
          d="M21 21V19C21 17.5195 20.1956 16.2268 19 15.5352"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="oi-vector"
          d="M17 21V19C17 16.7909 15.2091 15 13 15H7C4.79086 15 3 16.7909 3 19V21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="oi-vector"
          d="M16 10.4649C17.1956 9.77328 18 8.48059 18 7.00003C18 5.51946 17.1956 4.22678 16 3.53516"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="oi-ellipse"
          d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}