import React, { useEffect, useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

import "./Sort.css";

type Filter = {
  id?: number;
  field: string;
  operator: "==" | "!=" | "<" | "<=" | ">" | ">="; //TODO: support other operators
  valueType: "String" | "Number" | "Boolean";
  value: string | number | boolean;
};

type FilterProps = {
  anchor: HTMLDivElement | null;
  onClose: () => void;
  onSave: (filter: Filter) => void;
  filter?: Filter;
};

export default function Sort(props: FilterProps) {
  const [filter, setFilter] = React.useState<Filter>(
    props.filter
      ? props.filter
      : {
          field: "",
          operator: "==",
          valueType: "String",
          value: "",
        }
  );
  const [fieldInputError, setFieldInputError] = React.useState<boolean>(false);
  const [valueInputError, valueInputError] = React.useState<boolean>(false);

  const open = Boolean(props.anchor);
  const id = open ? "simple-popover" : undefined;

  const save = () => {
    // if (filter?.field?.length < 1) {
    //   setInputError(true);
    //   return;
    // }
    // setInputError(false);
    // props.onSave({ name: sortField, direction: sortDirection });
  };

  const close = () => {
    // setInputError(false);
    // props.onClose();
  };

  useEffect(() => {
    setFilter(
      props.filter
        ? props.filter
        : {
            field: "",
            operator: "==",
            valueType: "String",
            value: "",
          }
    );
  }, [props.filter]);

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
          <h3>Filter by</h3>
          <form autoComplete="off">
            <TextField
              id="standard-basic"
              label="Field"
              value={filter.field}
              onChange={({ target: { value } }) => {
                const { field, ...otherProps } = filter;
                setFilter({ field: value, ...otherProps });
              }}
              error={fieldInputError}
              helperText={fieldInputError ? "Please, enter field name" : null}
              onKeyDown={(e) => {
              //   if (e.key === "Enter")
              //     props.onSave({ name: sortField, direction: sortDirection });
              }}
            />

            {/* <FormControl style={{ marginLeft: "5px" }}>
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
            </FormControl> */}
          </form>
          <div className="button-panel">
            <Button onClick={save}>Save</Button>
            <Button onClick={close}>Cancel</Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
