// MenuOpcionesPaciente.js
import { Menu, ActionIcon, Group, Text } from "@mantine/core";
import {
  IconFilePlus,
  IconFileSearch,
  IconFileStack,
  IconChevronDown,
} from "@tabler/icons-react";
import classes from "./Menureporte.module.css";

interface MenuOpcionesPacienteProps {
  onCreateReport: () => void;
  onViewReports: () => void;
  onUploadReport: () => void;
  onToggleFiles: () => void;
}

function MenuOpcionesPaciente({
  onCreateReport,
  onViewReports,
  onUploadReport,
  onToggleFiles,
}: MenuOpcionesPacienteProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" className={classes.actionIcon}>
          <IconChevronDown size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown className={classes.menuDropdown}>
        <Menu.Item onClick={onCreateReport} className={classes.menuItem}>
          <Group gap="xs">
            <IconFilePlus size={16} className={classes.menuIcon} />
            <Text>Crear reporte</Text>
          </Group>
        </Menu.Item>
        <Menu.Item onClick={onViewReports} className={classes.menuItem}>
          <Group gap="xs">
            <IconFileSearch size={16} className={classes.menuIcon} />
            <Text>Ver reportes</Text>
          </Group>
        </Menu.Item>
        <Menu.Item onClick={onUploadReport} className={classes.menuItem}>
          <Group gap="xs">
            <IconFileStack size={16} className={classes.menuIcon} />
            <Text>Subir reporte</Text>
          </Group>
        </Menu.Item>
        <Menu.Item onClick={onToggleFiles} className={classes.menuItem}>
          <Group gap="xs">
            <IconChevronDown size={16} className={classes.menuIcon} />
            <Text>Desplegar archivos</Text>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default MenuOpcionesPaciente;
