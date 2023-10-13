import CheckIcon from "@mui/icons-material/Check";
import { ToggleButton } from "@mui/material";

const CustomToggleButton = ({ ...props }) => {
  return (
    <>
      <ToggleButton
        {...props}
        value="check"
        sx={{
          border: 0,
          padding: "2px",
          color: "black",
          "&:hover": {
            backgroundColor: "lightgreen",
          },
          "&.Mui-selected": {
            backgroundColor: "lightgreen",
            color: "green",
          },
        }}
      >
        <CheckIcon style={{ fontSize: "20px" }} />
      </ToggleButton>
    </>
  );
};
export { CustomToggleButton };
