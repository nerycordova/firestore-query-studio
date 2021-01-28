import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

import "./Sort.css";

type SortField = {
  name: string;
  direction: "asc" | "desc" | undefined;
};

type FilterProps = {
  anchor: HTMLDivElement | null;
  onClose: () => void;
  onSave: (criteria: SortField) => void;
};

export default function Sort(props: FilterProps) {
  const [sortField, setSortField] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<
    "asc" | "desc" | undefined
  >("asc");

  const open = Boolean(props.anchor);
  const id = open ? "simple-popover" : undefined;

  if (!open) return null;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={props.anchor}
        onClose={props.onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div style={{ margin: "10px" }}>
          <h3>Sort by</h3>
          <form autoComplete="off">
            <TextField
              id="standard-basic"
              label="Field"
              value={sortField}
              onChange={({ target: { value } }) => setSortField(value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  props.onSave({ name: sortField, direction: sortDirection });
              }}
            />

            <FormControl style={{ marginLeft: "5px" }}>
              <InputLabel id="demo-simple-select-label">Direction</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortDirection}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  if (
                    event.target.value === "asc" ||
                    event.target.value === "desc"
                  ) {
                    setSortDirection(event.target.value);
                  } else {
                    setSortDirection(undefined);
                  }
                }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </form>
          <div className="button-panel">
            <Button
              onClick={() =>
                props.onSave({ name: sortField, direction: sortDirection })
              }
            >
              Save
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
