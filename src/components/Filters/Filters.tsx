import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

import "./Filters.css";

type FilterProps = {
  anchor: HTMLButtonElement | null;
  onClose: () => void;
};

export default function Filters(props: FilterProps) {
  const [sortField, setSortField] = React.useState<string>("");

  const open = Boolean(props.anchor);
  const id = open ? "simple-popover" : undefined;

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
          horizontal: "center",
        }}
      >
        <div style={{ margin: "10px" }}>
          <h3>Sort</h3>
          <form autoComplete="off">
            <TextField
              id="standard-basic"
              label="Field"
              value={sortField}
              onChange={({ target: { value } }) => setSortField(value)}
            />

            <FormControl style={{marginLeft:'5px'}}>
              <InputLabel id="demo-simple-select-label">Direction</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={10}
                onChange={() => console.log("change")}
              >
                <MenuItem value={10}>Ascending</MenuItem>
                <MenuItem value={20}>Descending</MenuItem>
              </Select>
            </FormControl>
          </form>
					<div className="button-panel">
						<Button onClick={() => console.log('Save')}>Save</Button>
						<Button onClick={props.onClose}>Cancel</Button>
					</div>
        </div>
      </Popover>
    </div>
  );
}
