import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Head from "../../layouts/HeadDefault.js";
import Layout from "../../layouts/LayoutDefault.js";

// Default config (can be overridden by pages)
export default {
  Head,

  // <title>
  title: "DataSalud",
  extends: vikeReact,
  Wrapper: Layout,
} satisfies Config;
