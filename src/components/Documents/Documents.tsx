import React, { useState, useEffect, useCallback } from "react";
import firebase from "../../Firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Document from "../Document/Document";
import IconButton from "@material-ui/core/IconButton";
import FilterList from "@material-ui/icons/FilterList";
import Sort from "../Sort/Sort";
import Filter from "../Filter/Filter";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import "./Documents.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const firestore = firebase.firestore();
type DocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

type DocumentsProps = {
  collection: string;
};

export default function Documents(props: DocumentsProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastRecord, setLastRecord] = useState<DocumentSnapshot | null>(null);
  const [sortAnchor, setSortAnchor] = useState<HTMLDivElement | null>(null);
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filterAnchor, setFilterAnchor] = useState<HTMLDivElement | null>(null);
  const [filterList, setFilterList] = useState<Filter[]>([]);
  const [editingFilter, setEditingFilter] = useState<Filter | undefined>(
    undefined
  );
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);

  const QUERY_LIMIT = 5;

  const saveFilter = (filter: Filter) => {
    if (filter.id) {
      setFilterList(
        filterList.map((f: Filter) => (f.id === filter.id ? filter : f))
      );
    } else {
      filter.id = new Date().getTime();
      setFilterList([...filterList, filter]);
    }

    setFilterAnchor(null);
    setLastRecord(null);
    setDocuments([]);
  };

  const deleteFilter = (filter: Filter) => {
    if (filter.id) {
      setFilterList(filterList.filter((f) => f.id !== filter.id));
    }
    setLastRecord(null);
    setDocuments([]);
  };

  const fetchData = useCallback(
    async (last: DocumentSnapshot | null) => {
      if (props.collection.length < 1) return;
      setDocument(null);
      setLoading(true);
      let query = firestore.collection(props.collection).limit(QUERY_LIMIT);

      if (sortField) {
        query = query.orderBy(sortField.name, sortField.direction);
      } else {
        query = query.orderBy(firebase.firestore.FieldPath.documentId());
      }

      if (filterList.length > 0) {
        filterList.forEach((filter: Filter) => {
          let filterValue: any = filter.value;
          if (filter.valueType === "Boolean") {
            filterValue = filter.value === "True";
          }else if (filter.valueType === "Number"){
            filterValue = Number(filter.value);
          }
          query = query.where(
            filter.field,
            filter.operator,
            filterValue
          );
        });
      }

      if (last) {
        query = query.startAfter(last);
      }

      try {
        const result = await query.get();

        setLoading(false);

        setDocuments((documents) =>
          documents.concat(
            result.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
        );
        setLastRecord(result.docs[result.docs.length - 1]);
      } catch (error) {
        setLoading(false);
        setFetchError(
          error.message
            ? error.message
            : "There has been an error while running your query. Please check the console."
        );
        console.log(error);
      }
    },
    [sortField, filterList, props.collection]
  );

  useEffect(() => {
    fetchData(null);
  }, [fetchData]);

  const updateSort = (sort: SortField | undefined) => {
    setSortField(sort);
    setLastRecord(null);
    setDocuments([]);
    setSortAnchor(null);
  };

  if (props.collection.length === 0) return null;

  return (
    <div className="collection">
      <div className="documents-header">
        <h1>{props.collection}</h1>
        <div style={{ marginLeft: "10px" }}>
          <Chip
            label={`Sort by: ${
              sortField ? `${sortField.name} ${sortField.direction}` : "?"
            }`}
            color="primary"
            variant="outlined"
            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
              setSortAnchor(event.currentTarget)
            }
            onDelete={sortField ? () => updateSort(undefined) : undefined}
          />
          {sortAnchor && (
            <Sort
              anchor={sortAnchor}
              sort={sortField}
              onClose={() => setSortAnchor(null)}
              onSave={(criteria: SortField) => updateSort(criteria)}
            />
          )}
        </div>
        <div style={{ marginLeft: "10px" }}>
          <IconButton
            color="primary"
            component="span"
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              setFilterAnchor(event.currentTarget);
            }}
          >
            <FilterList />
          </IconButton>
          {filterAnchor && (
            <Filter
              filter={editingFilter}
              anchor={filterAnchor}
              onClose={() => {
                setFilterAnchor(null);
                setEditingFilter(undefined);
              }}
              onSave={(filter: Filter) => saveFilter(filter)}
            />
          )}
        </div>
        <div style={{ marginLeft: "10px" }}>
          {filterList.map((f, index) => {
            return (
              <Chip
                key={f.id}
                label={`${f.field} ${f.operator} ${f.value}`}
                style={index > 0 ? { marginLeft: "10px" } : undefined}
                color="primary"
                variant="outlined"
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  setFilterAnchor(event.currentTarget);
                  setEditingFilter(f);
                }}
                onDelete={() => deleteFilter(f)}
              />
            );
          })}
        </div>
      </div>
      <div className="document-body">
        <div className="documents">
          {(!documents || documents.length === 0) && (
            <div>No records found</div>
          )}
          {documents && documents.length > 0 && (
            <>
              <section>
                <List component="nav">
                  {documents.map((doc) => {
                    return (
                      <ListItem
                        button
                        key={doc.id}
                        selected={document ? doc.id === document.id : false}
                        onClick={() => setDocument(doc)}
                      >
                        <ListItemText primary={doc.id} />
                      </ListItem>
                    );
                  })}
                </List>
              </section>
            </>
          )}
          {loading && (
            <div style={{ marginLeft: "auto", marginRight: "auto" }}>
              <CircularProgress />
            </div>
          )}
          {lastRecord && (
            <Button onClick={() => fetchData(lastRecord)}>More</Button>
          )}
        </div>
        <Document document={document} />
      </div>
      {fetchError && (
        <>
          <Dialog
            open={Boolean(fetchError)}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setFetchError(undefined)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">Error</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {fetchError}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFetchError(undefined)} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
}
