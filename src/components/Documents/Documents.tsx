import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./Documents.css";
const firestore = firebase.firestore();

type DocumentsProps = {
  collection: string;
};

export default function Documents(props: DocumentsProps) {
  const [documents, setDocuments] = useState<string[]>([]);

  const getDocuments = async () => {
    //TODO: see if we can get only document IDs, otherwise might be worth caching document info
    //      so that we can use it when user clicks on document id
    const documents = await firestore
      .collection(props.collection)
      .limit(5)
      .get();
    //TODO: handle case when collection is empty
    setDocuments(documents.docs.map((doc) => doc.id));
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="documents">
      <h1>Documents</h1>
      {documents && documents.length > 0 && (
        <section>
          <List component="nav" aria-label="main mailbox folders">
            {documents.map((doc) => {
              return (
                <ListItem button key={doc}>
                  <ListItemText primary={doc} />
                </ListItem>
              );
            })}
          </List>
        </section>
      )}
    </div>
  );
}
