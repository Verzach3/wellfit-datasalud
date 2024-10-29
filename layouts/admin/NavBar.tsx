import React, { useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  TextInput,
  Code,
  UnstyledButton,
  Text,
  Image,
  Collapse,
  rem,
} from "@mantine/core";
import {
  IconFolder,
  IconSearch,
  IconLogout,
  IconUsers,
  IconReceipt2,
  IconChevronRight,
  IconReport,
  IconFiles,
  IconMessage2,
  IconStethoscope,
  IconUserFilled,
} from "@tabler/icons-react";
import classes from "./NavBar.module.css";
import { navigate } from 'vike/client/router';

const memberLinks = [
  { icon: IconUserFilled, label: "Lista de Pacientes", path: "/admin/patients" },
  { icon: IconFiles, label: "Archivos y Reportes", path: "/admin/patientsfiles" },
  { icon: IconMessage2, label: "Chat Data Salud", path: "/admin/chat" },
];

const mainLinks = [
  {
    icon: IconUsers,
    label: "Miembros",
    path: "/admin/members",
    subLinks: memberLinks,
  },


];

interface NavBarProps {
  opened: boolean;
  toggle: () => void;
  onNavigate: () => void;
}

export function NavBar({ opened, toggle, onNavigate }: NavBarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate();
    if (window.innerWidth <= 768) {
      toggle();
    }
  };

  const handleMainLinkClick = (link: typeof mainLinks[0]) => {
    if (link.subLinks) {
      setExpandedMenu(expandedMenu === link.label ? null : link.label);
    } else {
      handleNavigation(link.path);
    }
  };

  const handleLogout = () => {
    // Implementa aquí la lógica de cierre de sesión
    console.log("Cerrando sesión...");
    // Por ejemplo:
    // logout().then(() => navigate("/login"));
  };

  const renderLinks = mainLinks.map((link) => (
    <div key={link.label}>
      <UnstyledButton
        className={`${classes.mainLink} ${expandedMenu === link.label ? classes.mainLinkActive : ''}`}
        onClick={() => handleMainLinkClick(link)}
      >
        <div className={classes.mainLinkInner}>
          <link.icon size={24} className={classes.mainLinkIcon} stroke={1.5} />
          <span>{link.label}</span>
          {link.subLinks && (
            <IconChevronRight
              size={18}
              className={`${classes.chevron} ${
                expandedMenu === link.label ? classes.chevronRotated : ''
              }`}
            />
          )}
        </div>
      </UnstyledButton>

      {link.subLinks && (
        <Collapse in={expandedMenu === link.label}>
          <div className={classes.subLinks}>
            {link.subLinks.map((subLink) => (
              <UnstyledButton
                key={subLink.label}
                className={classes.subLink}
                onClick={() => handleNavigation(subLink.path)}
              >
                <subLink.icon size={18} className={classes.subLinkIcon} stroke={1.5} />
                <span>{subLink.label}</span>
              </UnstyledButton>
            ))}
          </div>
        </Collapse>
      )}
    </div>
  ));

  return (
    <>
      <AppShell.Header className={classes.header}>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
          />
          <Group>
            <IconStethoscope size={32} color="white" stroke={1.5} />
            <Image
              src="https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/wellfitclinic01%20(1).svg?t=2024-07-19T16%3A05%3A06.832Z"
              height={40}
              fit="contain"
              onClick={() => handleNavigation("/admin")}
              style={{ cursor: 'pointer' }}
            />
          </Group>
          <Text className={classes.headerTitle}>Panel Médico Administrativo</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar} hidden={!opened}>
        <TextInput
          placeholder="Buscar en el sistema..."
          size="md"
          leftSection={
            <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          }
          rightSectionWidth={70}
          rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
          styles={{ section: { pointerEvents: "none" } }}
          mb="md"
          className={classes.search}
        />

        <div className={classes.mainLinks}>{renderLinks}</div>

        <UnstyledButton className={classes.logoutButton} onClick={handleLogout}>
          <IconLogout size={20} className={classes.logoutIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </UnstyledButton>
      </AppShell.Navbar>
    </>
  );
}