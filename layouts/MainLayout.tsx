import React from 'react';
import { AppShell } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { NavBar } from "../components/MainLayout/NavBar";
import classes from './MainLayout.module.css';

function MainLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened }
      }}
      padding={0}
    >
      <NavBar opened={opened} toggle={toggle} />
      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;