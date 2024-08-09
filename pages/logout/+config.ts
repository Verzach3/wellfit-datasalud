import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Head from "../../layouts/HeadDefault.js";
import LayoutDefault from "@/layouts/LayoutDefault.jsx";

// Default config (can be overridden by pages)
export default {
  Head,
  Layout: LayoutDefault,
  title: "DataSalud",
  extends: vikeReact,

} satisfies Config;
