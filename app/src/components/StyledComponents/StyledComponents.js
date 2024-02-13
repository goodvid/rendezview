import { Stack, Button, Card, IconButton, styled } from "@mui/material";

export const YellowCard = styled(Card)({
  overflow: "auto",
  border: "3px solid #F2C879",
  borderRadius: "10px",
});

export const BlueCard = styled(Card)({
  overflow: "auto",
  border: "3px solid #1C3659",
  borderRadius: "10px",
});

export const ReadMoreButton = styled(Button)({
  textTransform: "none",
  border: "0px",
  "&:hover": {
    backgroundColor: "transparent",
  },
});

export const TextIconStack = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: "0.5rem",
});
