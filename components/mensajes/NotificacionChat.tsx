import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Group,
  ThemeIcon,
  List,
  Divider,
  Center,
} from "@mantine/core";
import { IconAlertCircle, IconRobot, IconNotes, IconStethoscope } from "@tabler/icons-react";

function NotificacionChat({ opened, onClose }: { opened: boolean, onClose: () => void }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconAlertCircle size={24} color="blue" />
          <Text size="xl" fw={700}>
            Observaciones Importantes
          </Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Center>
        <Text size="sm" ta="center" mt="md">
          Antes de usar el chat de DataSalud IA, por favor ten en cuenta las siguientes observaciones:
        </Text>
      </Center>
      <Divider my="sm" />
      <List
        spacing="md"
        size="sm"
        center
        icon={
          <ThemeIcon color="blue" size={24} radius="xl">
            <IconAlertCircle size={16} />
          </ThemeIcon>
        }
      >
        <List.Item
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconRobot size={16} />
            </ThemeIcon>
          }
        >
          El chat es guiado por inteligencia artificial y tiene como propósito brindarte recomendaciones basadas en la información médica proporcionada.
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="grape" size={24} radius="xl">
              <IconNotes size={16} />
            </ThemeIcon>
          }
        >
          Las sugerencias y recomendaciones dadas por la IA deben ser respaldadas por un médico certificado antes de ser seguidas.
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="orange" size={24} radius="xl">
              <IconStethoscope size={16} />
            </ThemeIcon>
          }
        >
          WellFit Clinic no se compromete a las consecuencias de seguir o no las observaciones de la IA. Consulta siempre con un médico.
        </List.Item>
      </List>
      <Divider my="md" />
      <Button fullWidth size="md" onClick={onClose}>
        Entendido
      </Button>
    </Modal>
  );
}

export default NotificacionChat;
