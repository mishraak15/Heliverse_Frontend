import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily: '"Poppins",sans-serif',
          fontWeight: "600",
          fontSize: "17px",
          textAlign: "center",
        },
        duration: 5000,
      }}
    />
    <App />
  </BrowserRouter>
);
