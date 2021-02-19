import React, { useEffect, useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

import "./Sort.css";

type SortProps = {
  anchor: HTMLDivElement | null;
  onClose: () => void;
  onSave: (criteria: SortField) => void;
  sort?: SortField;
};

export default function Sort(props: SortProps) {
  const [sortField, setSortField] = React.useState<string>(
    props.sort ? props.sort.name : ""
  );
  const [sortDirection, setSortDirection] = React.useState<
    "asc" | "desc" | undefined
  >(props.sort ? props.sort.direction : "asc");
  const [inputError, setInputError] = React.useState<boolean>(false);

  const open = Boolean(props.anchor);
  const id = open ? "simple-popover" : undefined;

  const save = () => {
    if (sortField.length < 1) {
      setInputError(true);
      return;
    }
    setInputError(false);
    props.onSave({ name: sortField, direction: sortDirection });
  };

  const close = () => {
    setInputError(false);
    setSortField("");
    setSortDirection("asc");
    props.onClose();
  };

  useEffect(() => {
    setSortField(props.sort ? props.sort.name : "");
    setSortDirection(props.sort ? props.sort.direction : "asc");
  }, [props.sort]);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={props.anchor}
      onClose={close}
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
            error={inputError}
            helperText={inputError ? "Please, enter field name" : null}
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
              <MenuItem value="asc" key="asc">Ascending</MenuItem>
              <MenuItem value="desc" key="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </form>
        <div className="button-panel">
          <Button onClick={save}>Save</Button>
          <Button onClick={close}>Cancel</Button>
        </div>
      </div>
    </Popover>
  );
}
