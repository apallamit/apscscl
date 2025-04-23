import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faPowerOff, faChartBar, faTachometerAlt, faTriangleExclamation, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Add FontAwesome icons to the library
library.add(
  faUser,
  faPowerOff,
  faChartBar,
  faTachometerAlt,
  faTriangleExclamation,
  faLock,
  faEye,
  faEyeSlash
);

createRoot(document.getElementById("root")!).render(<App />);
