import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  fontFamily: "Inter",
});

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MantineProvider theme={theme}><Notifications/>{children}</MantineProvider>;
}
