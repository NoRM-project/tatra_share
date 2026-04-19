type IconProps = {
  size?: number;
  className?: string
};

export default function SendIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* card */}
      <path
        d="M20 9.41422C20 8.72386 19.4404 8.16422 18.75 8.16422H2.75C2.05964 8.16422 1.5 8.72386 1.5 9.41422V19.4142C1.5 20.1046 2.05964 20.6642 2.75 20.6642H18.75C19.4404 20.6642 20 20.1046 20 19.4142V9.41422ZM21.5 19.4142C21.5 20.933 20.2688 22.1642 18.75 22.1642H2.75C1.23122 22.1642 0 20.933 0 19.4142V9.41422C0 7.89543 1.23122 6.66422 2.75 6.66422H18.75C20.2688 6.66422 21.5 7.89543 21.5 9.41422V19.4142Z"
        fill="currentColor"
      />

      {/* divider */}
      <path
        d="M20.75 11.6642C21.1642 11.6642 21.5 12 21.5 12.4142C21.5 12.8284 21.1642 13.1642 20.75 13.1642H0.75C0.335786 13.1642 0 12.8284 0 12.4142C0 12 0.335786 11.6642 0.75 11.6642H20.75Z"
        fill="currentColor"
      />

      {/* small square */}
      <path
        d="M15.75 16.6142C15.75 16.5038 15.8395 16.4142 15.95 16.4142H17.55C17.6605 16.4142 17.75 16.5038 17.75 16.6142V18.2142C17.75 18.3247 17.6605 18.4142 17.55 18.4142H15.95C15.8395 18.4142 15.75 18.3247 15.75 18.2142V16.6142Z"
        fill="currentColor"
        stroke="currentColor"
      />

      {/* arrow */}
      <path
        d="M10.75 10.4142V1.41422M10.75 1.41422L7.75 4.41422M10.75 1.41422L13.75 4.41422"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}