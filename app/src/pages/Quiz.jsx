import React from "react";
import { useState } from "react";
import { Box, Stack, Chip, Select, MenuItem } from "@mui/material";

function BubbleSelect() {
  const [selected, setSelected] = useState([]);
  const [tags, setTags] = useState([
    "Comedy",
    "Food",
    "Film",
    "Travel",
    "Rock",
    "Yoga",
    "DIY",
  ]);

  const handleSelect = (name) => {
    const tagSet = new Set(selected);
    if (!tagSet.has(name)) {
      tagSet.add(name);
    } else {
      tagSet.delete(name);
    }
    setSelected(tagSet);
  };

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

function Quiz() {
  return (
    <div>
      <Stack margin="3rem" gap="1rem">
        <Stack justifyContent="flex-start" textAlign="left">
          <h1>Tell us what you like</h1>
          <h3>
            Select interests to get event suggestions based on what you like
          </h3>
        </Stack>
        <Stack>
          <BubbleSelect />
        </Stack>
      </Stack>
    </div>
  );
}

export default Quiz;
