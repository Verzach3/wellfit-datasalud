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
  IconFolder,
  IconSearch,
  IconLogout,
  IconUsers,
  IconReceipt2,
} from "@tabler/icons-react";
import classes from "./NavBar.module.css";
import { navigate } from 'vike/client/router';

const links = [
  { icon: IconFolder, label: "Archivos", path: "/admin/patientsfiles" },
  { icon: IconUsers, label: "Pacientes", path: "/admin/patients" },
  { icon: IconReceipt2, label: "Transacciones", path: "/admin/transactions" },
];

interface NavBarProps {
  opened: boolean;
  toggle: () => void;
  onNavigate: () => void;
}

export function NavBar({ opened, toggle, onNavigate }: NavBarProps) {
  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate();
    if (window.innerWidth <= 768) {
      toggle();
    }
  };

  const handleLogout = () => {
    // Implementa aquí la lógica de cierre de sesión
    console.log("Cerrando sesión...");
    // Por ejemplo:
    // logout().then(() => navigate("/login"));
  };

  const mainLinks = links.map((link) => (
    <UnstyledButton
      key={link.label}
      className={classes.mainLink}
      onClick={() => handleNavigation(link.path)}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={24} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
    </UnstyledButton>
  ));

  return (
    <>
      <AppShell.Header className={classes.header}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
          <Image
            src="https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/wellfitclinic01%20(1).svg?t=2024-07-19T16%3A05%3A06.832Z"
            height={40}
            fit="contain"
            onClick={() => handleNavigation("/admin")}
            style={{ cursor: 'pointer' }}
          />
          <Text className={classes.headerTitle}>WellFit Admin Panel</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar} hidden={!opened}>
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

        <UnstyledButton className={classes.logoutButton} onClick={handleLogout}>
          <IconLogout size={20} className={classes.logoutIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </UnstyledButton>
      </AppShell.Navbar>
    </>
  );
}