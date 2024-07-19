import React from 'react';
import {
  TextInput,
  Code,
  UnstyledButton,
  Text,
  Group,
  Image,
  rem,
} from "@mantine/core";
import {
  IconUser,
  IconFolder,
  IconHeadset,
  IconSearch,
  IconLogout,
} from "@tabler/icons-react";
import { UserButton } from "./UserButton";
import classes from "./NavBar.module.css";

const links = [
  { icon: IconUser, label: "Mi cuenta" },
  { icon: "https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/datasaludlogo.avif", label: "Data-Salud", isImage: true },
  { icon: IconFolder, label: "Archivos" },
  { icon: IconHeadset, label: "Soporte en línea" },
];

export function NavBar() {
  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
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
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Image src="https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/wellfitclinic01%20(1).svg?t=2024-07-19T16%3A05%3A06.832Z" height={40} fit="contain" />
        <Text className={classes.headerTitle}>Data-Salud AI</Text>
      </div>

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
        <UnstyledButton className={classes.logoutButton}>
          <IconLogout size={20} className={classes.logoutIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </UnstyledButton>
      </Group>
    </nav>
  );
}