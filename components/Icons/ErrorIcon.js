export default ({ width = 33, height = 32, style }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <g>
      <circle
        cx="16.5"
        cy="16"
        r="15"
        fill="#ee3535"
        stroke="#ee3535"
        strokeWidth="2"
      />
    </g>
    <path d="M11 11 L22 22 M22 11 L11 22" stroke="white" strokeWidth="2" />
  </svg>
);
