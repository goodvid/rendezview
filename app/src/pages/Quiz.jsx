import React from "react";
import { useState, useCallback } from "react";
import { Alert, Box, Button, Chip, Stack, Snackbar } from "@mui/material";

function Quiz() {
  const [minSelected, setMinSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tags, setTags] = useState([
    //TODO: add more categories
    "Comedy",
    "Food",
    "Film",
    "Travel",
    "Rock",
    "Yoga",
    "DIY",
  ]);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSelect = useCallback(
    (name) => {
      const newSelected = new Set(selected);
      if (!newSelected.has(name)) {
        newSelected.add(name);
      } else {
        newSelected.delete(name);
      }

      setSelected(newSelected);
      setMinSelected(newSelected.size >= 3);
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
      // TODO: navigate to next page
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
          width="100%"
        >
          {tags.map((name) => (
            <div>
              <Chip
                label={name}
                variant={new Set(selected).has(name) ? "filled" : "outlined"}
                onClick={() => handleSelect(name)}
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
      <Stack margin="3rem" gap="1rem">
        <Stack justifyContent="flex-start" textAlign="left">
          <h1>Tell us what you like</h1>
          <h3>
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
