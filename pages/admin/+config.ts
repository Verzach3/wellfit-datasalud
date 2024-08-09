import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Head from "@/layouts/HeadDefault";
import AdminLayout from "@/layouts/admin/AdminLayout";
import LayoutDefault from "@/layouts/LayoutDefault";
// Default config (can be overridden by pages)
export default {
  Head,
  Layout: AdminLayout,
  title: "DataSalud",
  extends: vikeReact,
  Wrapper: LayoutDefault
} satisfies Config;
