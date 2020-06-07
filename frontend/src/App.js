import React from "react";
import "./App.css";

import Notes from "./Notes";

function App() {
  return (
    <div className="container">
      <div className="background-element"> </div>{" "}
      <div className="highlight-window">
        <div className="highlight-overlay"> </div>{" "}
      </div>{" "}
      <div className="window">
        <Notes />
      </div>{" "}
    </div>
  );
}

export default App;
