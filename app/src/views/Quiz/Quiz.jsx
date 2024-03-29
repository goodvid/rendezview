import React from "react";
import { useState, useCallback } from "react";
import { Alert, Box, Button, Chip, Stack, Snackbar } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "../../styles.css";

import categories from "../../views/eventCategories.json";


function Quiz() {
  let resp = false;
  const navigate = useNavigate();
  const [selectedStr, setSelectedStr] = useState("");
  const [minSelected, setMinSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSelect = useCallback(
    (name) => {
      const newSelected = new Set(selected);
      if (!newSelected.has(name)) {
        newSelected.add(name);
      } else {
        newSelected.delete(name);
      }

      let newStr = Array.from(newSelected).join(",");

      setSelected(newSelected);
      setMinSelected(newSelected.size >= 3);
      setSelectedStr(newStr);
    },
    [selected]
  );

  const handleAlertClick = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  // Alert if less than 3 selected
  const handleNext = useCallback(() => {
    if (minSelected) {
      // TODO add send to backend
      fetch("http://localhost:5000/profile/preferences", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: selectedStr }),
      }).then((response) => {
        if (response.status === 200) {
          resp = response;
          navigate("/");
          return response.json();
        } else {
          alert("unathorized");
          return false;
        }
      });
    } else {
      handleAlertClick();
    }
  }, [minSelected]);

  function BubbleSelect() {
    return (
      <Box>
        <Stack
          direction="row"
          gap="1rem"
          justifyContent="space-start"
          flexWrap="wrap"
          width="100%"
        >
          {categories.map((item, index) => (
            <div>
              <Chip
                key = {index}
                label = {item.name}
                variant={new Set(selected).has(item.name) ? "filled" : "outlined"}
                onClick={() => handleSelect(item.name)}
              />
            </div>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        bottom: "0px",
        right: "0px",
        left: "0px",
      }}
    >
      <Navbar />
      <Stack margin="3rem" gap="1rem">
        <Stack justifyContent="flex-start" textAlign="left">
          <h1>Tell us what you like</h1>
          <h3 style={{ color: "#818181" }}>
            Select 3 or more interests to get event suggestions based on what
            you like
          </h3>
        </Stack>

        <Stack>
          <BubbleSelect />
        </Stack>
      </Stack>
      <Stack
        style={{ position: "absolute", bottom: "0px", right: "0px" }}
        margin="2rem"
        justifyContent="space-between"
      >
        <Button
          variant={minSelected ? "contained" : "outlined"}
          onClick={handleNext}
        >
          Next
        </Button>
        <Snackbar
          open={alertOpen}
          autoHideDuration={5000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Please select at least 3 interests!
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}

export default Quiz;
