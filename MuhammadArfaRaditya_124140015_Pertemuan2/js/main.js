// js/main.js — Entry point aplikasi (ES6 import)
import { DashboardApp } from "./DashboardApp.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new DashboardApp();
  app.init();
});
