const TickIcon = ({ fill = "white" }: { fill?: string }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
        <path
          d="M5.16668 7.11475L11.2947 0.986084L12.238 1.92875L5.16668 9.00008L0.924011 4.75742L1.86668 3.81475L5.16668 7.11475Z"
          fill={fill}
        />
      </svg>
    </>
  );
};
export { TickIcon };
