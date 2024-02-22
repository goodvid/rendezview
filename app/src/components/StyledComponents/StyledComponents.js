import { Stack, Button, Card, Rating, styled } from "@mui/material";

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

export const YellowButton = styled(Button)({
  backgroundColor: "#F2C879",
  paddingInline: "1.5rem",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#E2B662",
    boxShadow: "none",
  },
});

export const RedButton = styled(Button)({
  backgroundColor: "#FF0000",
  paddingInline: "1.5rem",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#FF7F7F",
    boxShadow: "none",
  },
});

export const GrayButton = styled(Button)({
  backgroundColor: "#A9AFCB",
  paddingInline: "1.5rem",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#DEDEDE",
    boxShadow: "none",
  },
});