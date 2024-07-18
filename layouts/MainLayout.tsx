import { NavBar } from "../components/MainLayout/NavBar";
import LayoutDefault from "./LayoutDefault";
import { AppShell, Container, Title } from "@mantine/core";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      styles={{
        main: {
          overflow: "auto",
        },
      }}
    >
      <AppShell.Navbar>
        <NavBar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;
