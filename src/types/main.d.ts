type Filter = {
  id?: number;
  field: string;
  operator: "==" | "!=" | "<" | "<=" | ">" | ">="; //TODO: support other operators
  valueType: "String" | "Number" | "Boolean";
  value: string | number;
};

type SortField = {
  name: string;
  direction: "asc" | "desc" | undefined;
};
