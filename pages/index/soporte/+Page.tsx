import React, { useState } from 'react';
import { Container, Title, Text, Grid, Card, Button, Box, Input, Textarea, Image, Group, ThemeIcon } from '@mantine/core';
import { motion } from 'motion/react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineQuestionCircle, AiOutlineMessage, AiOutlineFileText, AiOutlineVideoCamera, AiOutlineBook } from 'react-icons/ai';
import styles from './page.module.css';

const faqs = [
  {
    question: '¿Qué es Data-Salud?',
    answer: 'Data-Salud es un sistema innovador que centraliza y simplifica tu historial médico, permitiendo un acceso rápido y seguro a tu información de salud.',
  },
  {
    question: '¿Cómo puedo acceder a mi perfil?',
    answer: 'Para acceder a tu perfil, ingresa tu correo electrónico y recibirás un enlace de acceso directo en tu correo.',
  },
  {
    question: '¿Es seguro el manejo de mis datos?',
    answer: 'Sí, todos tus datos están protegidos con las mejores medidas de seguridad disponibles, incluyendo encriptación de punta a punta y autenticación de dos factores.',
  },
  {
    question: '¿Puedo compartir mi historial médico con mi doctor?',
    answer: 'Sí, Data-Salud te permite compartir tu historial médico de forma segura con los profesionales de salud que elijas, facilitando una atención más personalizada y eficiente.',
  },
];

const resources = [
  {
    title: 'Guía de Inicio Rápido',
    description: 'Aprende a configurar tu cuenta y comenzar a usar Data-Salud en minutos.',
    icon: <AiOutlineFileText size={40} />,
  },
  {
    title: 'Videos Tutoriales',
    description: 'Serie de videos explicativos sobre todas las funcionalidades de Data-Salud.',
    icon: <AiOutlineVideoCamera size={40} />,
  },
  {
    title: 'Manual Completo',
    description: 'Documento detallado con todas las características y mejores prácticas de uso.',
    icon: <AiOutlineBook size={40} />,
  },
];

const SoporteEnLinea: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const handleQuestionClick = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className={styles.wrapper}>
      <Container size="lg" className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title order={1} className={styles.mainTitle}>
            Soporte en Línea para Data-Salud
          </Title>
          <Text className={styles.subtitle}>
            Tu centro de asistencia integral para aprovechar al máximo Data-Salud
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.section}
        >
          <Title order={2} className={styles.sectionTitle}>
            Preguntas Frecuentes
          </Title>
          <Grid gutter="md">
            {faqs.map((faq, index) => (
              <Grid.Col key={index} span={12}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuestionClick(index)}
                >
                  <Card shadow="sm" radius="md" className={styles.faqCard}>
                    <Group  gap="md">
                      <ThemeIcon size={40} radius="md" variant="light" color="blue">
                        <AiOutlineQuestionCircle size={24} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="lg">
                          {faq.question}
                        </Text>
                        {activeQuestion === index && (
                          <Text size="sm" color="dimmed" mt="sm">
                            {faq.answer}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </Card>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={styles.section}
        >
          <Title order={2} className={styles.sectionTitle}>
            Contáctanos
          </Title>
          <Card shadow="sm" radius="md" className={styles.contactCard}>
            <form className={styles.contactForm}>
              <Input
                leftSection={<AiOutlineMail />}
                placeholder="Correo Electrónico"
                size="md"
                required
              />
              <Input
                leftSection={<AiOutlinePhone />}
                placeholder="Teléfono"
                size="md"
                required
              />
              <Textarea
                placeholder="Tu Mensaje"
                minRows={4}
                size="md"
                required
              />
              <Button size="md" className={styles.submitButton}>
                Enviar Mensaje
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={styles.section}
        >
          <Title order={2} className={styles.sectionTitle}>
            Chat en Vivo
          </Title>
          <Card shadow="sm" radius="md" className={styles.chatCard}>
            <Group  gap="xl">
              <ThemeIcon size={60} radius="md" variant="light" color="green">
                <AiOutlineMessage size={40} />
              </ThemeIcon>
              <div>
                <Text size="lg" fw={500}>
                  Asistencia Inmediata
                </Text>
                <Text size="sm" color="dimmed" mt="xs">
                  Conéctate con uno de nuestros agentes para obtener ayuda en tiempo real.
                </Text>
                <Button
                  variant="light"
                  color="green"
                  size="md"
                  mt="md"
                  onClick={() => window.open('https://meet.google.com/gim-craa-akr', '_blank')}
                >
                  Iniciar Chat
                </Button>
              </div>
            </Group>
          </Card>
        </motion.div>

       
      </Container>
    </div>
  );
};

export default SoporteEnLinea;