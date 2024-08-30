import React, { useCallback } from "react";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavBar } from "./NavBar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();

  const handleNavigation = useCallback(() => {
    if (window.innerWidth <= 768) {
      close();
    }
  }, [close]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <NavBar opened={opened} toggle={toggle} onNavigate={handleNavigation} />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default AdminLayout;