import "./styles/accordeons_styles.css";
import { initWidget } from "./scripts/initWidget.js";

const cleanupWidget = initWidget();

if (import.meta.hot) import.meta.hot.dispose(cleanupWidget);
