import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Code from "@material-ui/icons/Code";
import Button from "@material-ui/core/Button";

import Filters from "../Filters/Filters";

import "./Documents.css";
const firestore = firebase.firestore();

type DocumentsProps = {
  collection: string;
  selectedDocument: any;
  onSelectDocument: (document: any) => void;
};

export default function Documents(props: DocumentsProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [
    lastRecord,
    setLastRecord,
  ] = useState<firebase.firestore.QueryDocumentSnapshot | null>(null);

  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  const QUERY_LIMIT = 20;

  const getDocuments = async () => {
    if (props.collection.length < 1) return;
    setLoading(true);
    const result = await firestore
      .collection(props.collection)
      .limit(QUERY_LIMIT)
      .orderBy("email") //TODO: ask user to select sort parameter
      .startAfter(lastRecord)
      .get();
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
  }, []);

  if (props.collection.length === 0) return null;

  return (
    <div className="documents">
      <div className="documents-header">
        <h1>{props.collection}</h1>
        <div>
          <IconButton
            color="primary"
            aria-label="collection filter"
            component="span"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              setFilterAnchor(event.currentTarget)
            }
          >
            <Code />
          </IconButton>
        </div>
        <Filters anchor={filterAnchor} onClose={() => setFilterAnchor(null)} />
      </div>
      {documents && documents.length > 0 && (
        <>
          <section>
            <List component="nav">
              {documents.map((doc) => {
                return (
                  <ListItem
                    button
                    key={doc.id}
                    selected={
                      props.selectedDocument
                        ? doc.id === props.selectedDocument.id
                        : false
                    }
                    onClick={() => props.onSelectDocument(doc)}
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
  );
}
