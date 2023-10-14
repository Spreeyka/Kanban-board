import { IconButton } from "@mui/material";
import { TickIcon } from "../../../../assets/icons/Tick";

const EditConfirmButton = ({ ...props }) => {
  return (
    <>
      <IconButton
        {...props}
        aria-label="finish editing"
        size="large"
        role="button"
        component="div"
        sx={{
          border: 0,
          padding: "6px",
          borderRadius: 0,
          "&:hover": {
            backgroundColor: "lightgreen",
          },
        }}
      >
        <TickIcon fill="green" />
      </IconButton>
    </>
  );
};
export { EditConfirmButton };
