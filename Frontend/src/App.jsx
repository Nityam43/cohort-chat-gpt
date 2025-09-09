import { useState } from "react";

import "./App.css";
import AppRoutes from "./AppRoutes";
import AuthDebug from "./components/AuthDebug";

function App() {
  return (
    <>
      <AppRoutes />
      <AuthDebug />
    </>
  );
}

export default App;
