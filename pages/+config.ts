import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Head from "../layouts/HeadDefault.js";
import MainLayout from "../layouts/MainLayout.jsx";

// Default config (can be overridden by pages)
export default {
  Head,
  title: "DataSalud",
  extends: vikeReact,
} satisfies Config;
