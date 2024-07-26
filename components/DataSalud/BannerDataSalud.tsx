import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Grid, Card, Image, Button, Box } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AiOutlineFileSearch, AiOutlineSafety, AiOutlineUser, AiOutlineBarChart, AiOutlineFile } from 'react-icons/ai';
import styles from './BannerDataSalud.module.css';

const benefits = [
  {
    title: 'Información Centralizada',
    description: 'Acceso a todos tus registros médicos en un solo lugar seguro y organizado.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/InformacionCentralizada.avif?t=2024-07-18T18%3A00%3A54.469Z',
    icon: AiOutlineFileSearch,
  },
  {
    title: 'Resumen Inteligente',
    description: 'Visualiza tu historial médico con gráficos interactivos y resúmenes claros.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/InformesFaciles.avif?t=2024-07-18T18%3A01%3A13.800Z',
    icon: AiOutlineFile,
  },
  {
    title: 'Seguridad Avanzada',
    description: 'Protección de datos de nivel militar para tu tranquilidad absoluta.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/ProteccionDatos.avif?t=2024-07-18T18%3A03%3A25.484Z',
    icon: AiOutlineSafety,
  },
  {
    title: 'Atención Personalizada',
    description: 'Obtén recomendaciones de salud basadas en tu historial único.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/MejorAtencion.avif?t=2024-07-18T18%3A03%3A41.792Z',
    icon: AiOutlineUser,
  },
];

const steps = [
  {
    title: 'Recopilación de Datos',
    description: 'Importamos y digitalizamos tus registros médicos de forma segura y eficiente.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/RecopilacionDatos.avif?t=2024-07-18T17%3A58%3A35.136Z',
    icon: AiOutlineFileSearch,
  },
  {
    title: 'Análisis Preliminar',
    description: 'Nuestros algoritmos de IA analizan tus datos para detectar patrones y tendencias.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/AnalisisPreliminar.avif?t=2024-07-18T18%3A00%3A00.173Z',
    icon: AiOutlineBarChart,
  },
  {
    title: 'Interacción Personalizada',
    description: 'Refinamos tu perfil de salud mediante entrevistas interactivas y cuestionarios adaptados.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/RecopilacionDatoss.avif?t=2024-07-18T17%3A58%3A52.231Z',
    icon: AiOutlineUser,
  },
  {
    title: 'Análisis Integral',
    description: 'Realizamos un análisis profundo para generar insights valiosos sobre tu salud.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/AnalisisIntegral.avif?t=2024-07-18T17%3A51%3A31.334Z',
    icon: AiOutlineBarChart,
  },
  {
    title: 'Recomendaciones Personalizadas',
    description: 'Generamos un informe detallado con recomendaciones a medida para mejorar tu salud.',
    image: 'https://xulaswsegmeymlufkcid.supabase.co/storage/v1/object/public/resources/BannerDataSalud/InformesRecomendacion.avif?t=2024-07-18T17%3A59%3A45.573Z',
    icon: AiOutlineFile,
  },
];

const MasteryDataSalud: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [processRef, processInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <Title order={1} className={styles.mainTitle}>
            Revoluciona tu Salud con Data-Salud
          </Title>
        
               <Text className={styles.subtitle}>
                Simplifica tu historial médico y obtén insights personalizados para una vida más saludable
                </Text> 
      
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="xl" className={styles.heroButton}>Descubre Data-Salud</Button>
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.benefitsSection} ref={benefitsRef}>
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Title order={2} className={styles.sectionTitle}>Beneficios Clave</Title>
            <Grid gutter="xl">
              {benefits.map((benefit, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card shadow="md" radius="lg" className={styles.benefitCard}>
                      <benefit.icon size={48} className={styles.benefitIcon} />
                      <Image src={benefit.image} alt={benefit.title} height={150} className={styles.benefitImage} />
                      <Title order={3} className={styles.cardTitle}>{benefit.title}</Title>
                      <Text className={styles.cardText}>{benefit.description}</Text>
                    </Card>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </section>

      <section className={styles.processSection} ref={processRef}>
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Title order={2} className={styles.sectionTitle}>Nuestro Proceso</Title>
            <Grid gutter="xl" align="center">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    className={styles.stepImageContainer}
                  >
                    <Image src={steps[activeStep].image} alt={steps[activeStep].title} className={styles.stepImage} />
                    <div className={styles.stepIconOverlay}>
                      {React.createElement(steps[activeStep].icon, { size: 64 })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box className={styles.stepInfo}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Title order={3} className={styles.stepTitle}>{steps[activeStep].title}</Title>
                      <Text className={styles.stepDescription}>{steps[activeStep].description}</Text>
                    </motion.div>
                  </AnimatePresence>
                  <Box className={styles.stepNavigation}>
                    {steps.map((_, index) => (
                      <Button
                        key={index}
                        variant={index === activeStep ? "filled" : "outline"}
                        onClick={() => setActiveStep(index)}
                        className={styles.stepButton}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </motion.div>
        </Container>
      </section>

      <section className={styles.ctaSection}>
        <Container size="xl">
          <Title order={2} className={styles.ctaTitle}>¡Obtén tu perfil personalizado ahora!</Title>
          <Text className={styles.ctaText}>Descubre cómo Data-Salud puede transformar tu bienestar por solo 50,000 pesos</Text>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="xl" className={styles.ctaButton}>Quiero Mi Perfil</Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default MasteryDataSalud;