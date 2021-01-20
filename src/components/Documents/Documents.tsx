import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";

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

  const QUERY_LIMIT = 20;

  const getDocuments = async () => {
    if (props.collection.length < 1) return;
    //TODO: see if we can get only document IDs, otherwise might be worth caching document info
    //      so that we can use it when user clicks on document id
    setLoading(true);
    const result = await firestore
      .collection(props.collection)
      .limit(QUERY_LIMIT)
      .get();
    //TODO: handle case when collection is empty
    setLoading(false);
    setDocuments(result.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="documents">
      <h1>Documents</h1>
      {loading && (
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <CircularProgress />
        </div>
      )}
      {documents && documents.length > 0 && (
        <section>
          <List component="nav" aria-label="main mailbox folders">
            {documents.map((doc) => {
              return (
                <ListItem
                  button
                  key={doc.id}
                  selected={ props.selectedDocument ? doc.id === props.selectedDocument.id : false}
                  onClick={() => props.onSelectDocument(doc)}
                >
                  <ListItemText primary={doc.id} />
                </ListItem>
              );
            })}
          </List>
        </section>
      )}
    </div>
  );
}
