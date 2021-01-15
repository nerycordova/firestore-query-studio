import "./App.css";
import Collection from "./components/Collection/Collection";
import Documents from "./components/Documents/Documents";

function App() {
  return (
    <div className="App">
      <Collection />
      {/* TODO: pass collection name from Collection component click */}
      <Documents collection="User"/>
    </div>
  );
}

export default App;
