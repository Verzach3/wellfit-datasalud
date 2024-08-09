import { useEffect, useState } from 'react';
import { Group, Code, Text, UnstyledButton } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconFiles,
} from '@tabler/icons-react';
import classes from './NavBar.module.css';
import { navigate } from 'vike/client/router';

const data = [
  { link: '', label: 'Archivos', icon: IconFiles },
  // { link: '', label: 'Billing', icon: IconReceipt2 },
  // { link: '', label: 'Security', icon: IconFingerprint },
  // { link: '', label: 'SSH Keys', icon: IconKey },
  // { link: '', label: 'Databases', icon: IconDatabaseImport },
  // { link: '', label: 'Authentication', icon: Icon2fa },
  // { link: '', label: 'Other Settings', icon: IconSettings },
];

export function AdminNavbar() {
  const [active, setActive] = useState('Billing');

  useEffect(() => {
    (async ( ) => {

      supabase.storage.from("patient-documents").list(`${(await supabase.auth.getSession()).data.session?.user.id}/`).then((res) => {
        console.log(res);
      })
    })()
  }, [])

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text fw={700}>WellFit Admin</Text>
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <UnstyledButton className={classes.link} onClick={() => navigate("/logout")}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </UnstyledButton>
      </div>
    </nav>
  );
}