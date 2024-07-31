import React from 'react';
import {
  AppShell,
  Burger,
  Group,
  TextInput,
  Code,
  UnstyledButton,
  Text,
  Image,
  rem,
} from "@mantine/core";
import {
  IconUser,
  IconFolder,
  IconHeadset,
  IconSearch,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { UserButton } from "./UserButton";
import classes from "./NavBar.module.css";
import { navigate } from 'vike/client/router';

const links = [
  { icon: IconHome, label: "Inicio", path: "/" },
  { icon: IconUser, label: "Mi cuenta", path: "/onboarding" },
  { icon: "https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/datasaludlogo.avif", label: "Data-Salud", isImage: true, path: "/chat" },
  { icon: IconFolder, label: "Archivos", path: "/files" },
  { icon: IconHeadset, label: "Soporte en línea", path: "/support" },
];

interface NavBarProps {
  opened: boolean;
  toggle: () => void;
}

export function NavBar({ opened, toggle }: NavBarProps) {
  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      toggle();
    }
  };

  const mainLinks = links.map((link) => (
    <UnstyledButton
      key={link.label}
      className={classes.mainLink}
      onClick={() => handleNavigation(link.path ?? "")}
    >
      <div className={classes.mainLinkInner}>
        {link.isImage ? (
          <Image src={link.icon} width={24} height={24} className={classes.mainLinkIcon} />
        ) : (
          <link.icon size={24} className={classes.mainLinkIcon} stroke={1.5} />
        )}
        <span>{link.label}</span>
      </div>
    </UnstyledButton>
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header className={classes.header}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
          <Image
            src="https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/wellfitclinic01%20(1).svg?t=2024-07-19T16%3A05%3A06.832Z"
            height={40}
            fit="contain"
            onClick={() => handleNavigation("/")}
            style={{ cursor: 'pointer' }}
          />
          <Text className={classes.headerTitle}>Data-Salud AI</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar}>
        <TextInput
          placeholder="Buscar"
          size="md"
          leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
          rightSectionWidth={70}
          rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
          styles={{ section: { pointerEvents: "none" } }}
          mb="md"
          className={classes.search}
        />

        <div className={classes.mainLinks}>{mainLinks}</div>

        <Group className={classes.footer}>
          <UserButton />
          <UnstyledButton className={classes.logoutButton} onClick={() => handleNavigation("/logout")}>
            <IconLogout size={20} className={classes.logoutIcon} stroke={1.5} />
            <span>Cerrar sesión</span>
          </UnstyledButton>
        </Group>
      </AppShell.Navbar>
    </AppShell>
  );
}