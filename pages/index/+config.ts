import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Head from "../../layouts/HeadDefault.js";
import MainLayout from "../../layouts/MainLayout.jsx";
import LayoutDefault from "../../layouts/LayoutDefault.jsx";

// Default config (can be overridden by pages)
export default {
  Head,
  // <title>
  title: "DataSalud",
  extends: vikeReact,
  Layout: MainLayout,
  Wrapper: LayoutDefault,
} satisfies Config;
