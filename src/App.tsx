import { useState } from "react";
import "./App.css";
import Collection from "./components/Collection/Collection";
import Documents from "./components/Documents/Documents";
import Document from "./components/Document/Document";

function App() {
  const [collection, setCollection] = useState<string>("");
  const [document, setDocument] = useState<any>(null);

  return (
    <div className="App">
      <Collection
        selectedCollection={collection}
        onSelectCollection={(collection: string) => {
          setCollection(collection);
          setDocument(null);
        }}
      />
      <Documents
        key={collection}
        collection={collection}
        selectedDocument={document}
        onSelectDocument={(document: any) => setDocument(document)}
      />
      <Document document={document} />
    </div>
  );
}

export default App;
