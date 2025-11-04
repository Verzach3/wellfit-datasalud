import React from 'react';
import { Container, Title, Text, Grid, Card, Button, ThemeIcon } from '@mantine/core';
import { motion } from 'motion/react';
import { AiOutlineFileText, AiOutlineVideoCamera, AiOutlineBook } from 'react-icons/ai';
import styles from './page.module.css';

const pdfUrl = "https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/Guias/GUIA-DATASALUD.pdf?t=2024-09-13T19%3A29%3A31.466Z";

const resources = [
  {
    title: 'Guía de Inicio Rápido',
    description: 'Aprende a configurar tu cuenta y comenzar a usar Data-Salud en minutos.',
    icon: <AiOutlineFileText size={40} />,
    action: () => window.open(pdfUrl, '_blank'),
  },
  {
    title: 'Videos Tutoriales',
    description: 'Serie de videos explicativos sobre todas las funcionalidades de Data-Salud.',
    icon: <AiOutlineVideoCamera size={40} />,
    action: () => alert('Videos tutoriales próximamente disponibles'),
  },
  {
    title: 'Manual Completo',
    description: 'Documento detallado con todas las características y mejores prácticas de uso.',
    icon: <AiOutlineBook size={40} />,
    action: () => window.open(pdfUrl, '_blank'),
  },
];

const RecursosYGuias: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Container size="lg" className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title order={1} className={styles.mainTitle}>
            Recursos y Guías de Data-Salud
          </Title>
          <Text className={styles.subtitle}>
            Descubre todas las herramientas para aprovechar al máximo Data-Salud
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.section}
        >
          <Grid gutter="md">
            {resources.map((resource, index) => (
              <Grid.Col key={index} span={12} >
                <Card shadow="sm" radius="md" className={styles.resourceCard}>
                  <Card.Section className={styles.resourceIconSection}>
                    <ThemeIcon size={60} radius="md" variant="light" color="blue">
                      {resource.icon}
                    </ThemeIcon>
                  </Card.Section>
                  <Text fw={500} size="lg" mt="md">
                    {resource.title}
                  </Text>
                  <Text size="sm" color="dimmed" mt="sm">
                    {resource.description}
                  </Text>
                  <Button 
                    variant="light" 
                    color="blue" 
                    fullWidth 
                    mt="md" 
                    radius="md"
                    onClick={resource.action}
                  >
                    Acceder
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
};

export default RecursosYGuias;