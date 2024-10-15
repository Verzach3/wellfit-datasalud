import React from 'react';
import { Modal, Text, Button, List } from '@mantine/core';
import styles from './NotificacionArchivos.module.css';

interface NotificacionArchivosProps {
  opened: boolean;
  onClose: () => void;
}

const NotificacionArchivos: React.FC<NotificacionArchivosProps> = ({ opened, onClose }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Información Importante sobre el Procesamiento de Archivos"
      size="lg"
      centered
      className={styles.notificacionModal}
    >
      <Text className={styles.notificacionText}>
        Has aceptado los términos y condiciones. Por favor, ten en cuenta la siguiente información importante:
      </Text>
      <List className={styles.notificacionList}>
        <List.Item>La documentación que subas será procesada por inteligencia artificial para generar tu perfil médico.</List.Item>
        <List.Item>Las recomendaciones generadas se basan en el análisis de tus datos médicos.</List.Item>
        <List.Item>Entiendes que las sugerencias provienen de una IA y no sustituyen el consejo médico profesional.</List.Item>
        <List.Item>Eres responsable de tomar decisiones informadas basadas en estas recomendaciones.</List.Item>
        <List.Item>Consulta siempre con un médico antes de realizar cualquier cambio en tu tratamiento o salud.</List.Item>
      </List>
      <Button onClick={onClose} fullWidth mt="md" className={styles.notificacionButton}>
        Entendido
      </Button>
    </Modal>
  );
};

export default NotificacionArchivos;