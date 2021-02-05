import React, { useState, useEffect } from "react";
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

import "./Documents.css";
const firestore = firebase.firestore();

type DocumentsProps = {
  collection: string;
};

type SortField = {
  name: string;
  direction: "asc" | "desc" | undefined;
};

export default function Documents(props: DocumentsProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [
    lastRecord,
    setLastRecord,
  ] = useState<firebase.firestore.QueryDocumentSnapshot | null>(null);
  const [sortAnchor, setSortAnchor] = useState<HTMLDivElement | null>(null);
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);

  const [filterAnchor, setFilterAnchor] = useState<HTMLDivElement | null>(null);

  const QUERY_LIMIT = 5;

  const getDocuments = async () => {
    if (props.collection.length < 1) return;
    setLoading(true);
    let query = firestore.collection(props.collection).limit(QUERY_LIMIT);

    if (sortField) {
      query = query.orderBy(sortField.name, sortField.direction);
    } else {
      query = query.orderBy(firebase.firestore.FieldPath.documentId());
    }

    if (lastRecord) {
      query = query.startAfter(lastRecord);
    }

    const result = await query.get();

    //TODO: handle case when collection is empty
    setLoading(false);

    setDocuments(
      documents.concat(
        result.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
    );
    setLastRecord(result.docs[result.docs.length - 1]);
  };

  useEffect(() => {
    getDocuments();
  }, [sortField]);

  const resetView = (sort: SortField | undefined) => {
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
            onDelete={sortField ? () => resetView(undefined) : undefined}
          />
          {sortAnchor && (
            <Sort
              anchor={sortAnchor}
              sort={sortField}
              onClose={() => setSortAnchor(null)}
              onSave={(criteria: SortField) => resetView(criteria)}
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
              anchor={filterAnchor}
              onClose={() => setFilterAnchor(null)}
              onSave={() => {}}
            />
          )}
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
          {lastRecord && <Button onClick={() => getDocuments()}>More</Button>}
        </div>
        <Document document={document} />
      </div>
    </div>
  );
}
