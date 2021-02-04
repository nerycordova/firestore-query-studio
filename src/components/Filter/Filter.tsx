import React, { useEffect, useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

import "./Filter.css";

type Filter = {
  id?: number;
  field: string;
  operator: "=" | "!=" | "<" | "<=" | ">" | ">="; //TODO: support other operators
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
          operator: "=",
          valueType: "String",
          value: "",
        }
  );
  const [fieldInputError, setFieldInputError] = React.useState<boolean>(false);
  const [valueInputError, setValueInputError] = React.useState<boolean>(false);

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
    setFieldInputError(false);
    setValueInputError(false);
    props.onClose();
  };

  useEffect(() => {
    setFilter(
      props.filter
        ? props.filter
        : {
            field: "",
            operator: "=",
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
              id="field-name"
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

            <FormControl style={{ marginLeft: "10px", marginRight: "10px" }}>
              <InputLabel id="operator-label"></InputLabel>
              <Select
                id="operator"
                labelId="operator-label"
                value={filter.operator}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const value = event.target.value as string;
                  if (
                    value === "=" ||
                    value === "!=" ||
                    value === "<" ||
                    value === "<=" ||
                    value === ">" ||
                    value === ">="
                  ) {
                    const { operator, ...otherProps } = filter;
                    setFilter({ operator: value, ...otherProps });
                  }
                }}
              >
                {["=", "!=", "<", "<=", ">", ">="].map((o) => (
                  <MenuItem value={o}>{o}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl style={{ marginLeft: "10px", marginRight: "10px" }}>
              <InputLabel id="type-label"></InputLabel>
              <Select
                id="type"
                labelId="type-label"
                value={filter.valueType}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const value = event.target.value as string;
                  if (
                    value === "String" ||
                    value === "Number" ||
                    value === "Boolean"
                  ) {
                    const { valueType, ...otherProps } = filter;
                    setFilter({ valueType: value, ...otherProps });
                  }
                }}
              >
                {["String", "Number", "Boolean"].map((t) => (
                  <MenuItem value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="field-value"
              label="Value"
              value={filter.value}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                const { value, ...otherProps } = filter;
                setFilter({
                  value: event.target.value as string,
                  ...otherProps,
                });
              }}
              error={valueInputError}
              helperText={valueInputError ? "Please, enter a value" : null}
              onKeyDown={(e) => {
                //   if (e.key === "Enter")
                //     props.onSave({ name: sortField, direction: sortDirection });
              }}
            />
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
