import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { Toaster } from "sonner"; //for error and notifications handling ("password incorrect
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/LoadingSpinner";
// ")

//loding spinner to display when the page is loading
const CustomSkeleton = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner/> : <>{children}</>}</>;
};


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <CustomSkeleton>
        <App />
      </CustomSkeleton>
      <Toaster />
    </Provider>
  </StrictMode>
);
