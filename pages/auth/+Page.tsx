import React, { useEffect, useState } from 'react';
import {
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Image,
  Card,
  Container,
  LoadingOverlay,
  Modal,
  Checkbox,
  Anchor,
} from "@mantine/core";
import { motion } from 'framer-motion';
import { IconMail } from '@tabler/icons-react';
import wellfitLogo from "../../assets/wellfit-bottom-text.svg";
import classes from "./page.module.css";
import { navigate } from "vike/client/router";
import SupportButton from '../index/pqrs/+Page';
import TermsAndConditions from '../index/gestor_normativo/+Page';

function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    // ... (código existente del useEffect)
  }, []);

  async function handleLogin(email: string) {
    if (!termsAccepted) {
      alert("Por favor, acepta los términos y condiciones antes de continuar.");
      return;
    }

    setShowConfirmationModal(true);
  }

  async function sendOTP() {
    setIsSubmitting(true);
    try {
      console.log("Sending OTP to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
      console.log("OTP sent successfully");
      alert("Se ha enviado un token de autenticación a tu correo electrónico.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Hubo un error al enviar el token. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmationModal(false);
    }
  }

  if (loading) {
    // ... (código existente para el loading)
  }

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.backgroundAnimation}></div>
      <Container size="xs" className={classes.containerWrapper}>
        <Card
          withBorder
          shadow="md"
          p="xl"
          radius="md"
          className={classes.cardWrapper}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack gap="md" align="center">
              <Title className={classes.title} ta="center">
                Bienvenido a DataSalud 
              </Title>
              <Group gap="xs" align="center">
                <Title ta= "center" fw={500} c="dimmed" size="sm">
                by
                </Title>
                <Image src={wellfitLogo} width={80} fit="contain" />
              </Group>
              <Text c="dimmed" size="sm" ta="center" mt="md">
                Ingresa tu email para recibir un link de inicio de sesión
              </Text>
              <Card withBorder p="lg" radius="md" className={classes.innerCard}>
                <TextInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Tu correo electrónico"
                  placeholder="correo@ejemplo.com"
                  required
                  rightSection={<IconMail size="1rem" />}
                  classNames={{ input: classes.input, label: classes.inputLabel }}
                />
                <Button
                  loading={isSubmitting}
                  fullWidth
                  mt="xl"
                  size="md"
                  className={classes.submitButton}
                  onClick={() => handleLogin(email)}
                >
                  Enviarme un Link
                </Button>
                <Group mt="md" gap="apart">
                  <Checkbox
                    label="Acepto los términos y condiciones"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.currentTarget.checked)}
                  />
                  <Anchor onClick={() => setShowTermsModal(true)}>
                    Leer términos y condiciones
                  </Anchor>
                </Group>
              </Card>
            </Stack>
          </motion.div>
        </Card>
      </Container>
      <SupportButton />

      {/* Modal de Términos y Condiciones */}
      <Modal
        opened={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Términos y Condiciones"
        size="lg"
      >
        <TermsAndConditions onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }} />
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        opened={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title="Confirmar envío"
      >
        <Text>¿Estás seguro de que deseas enviar el token de autenticación a {email}?</Text>
        <Group mt="md" gap="right">
          <Button variant="outline" onClick={() => setShowConfirmationModal(false)}>Cancelar</Button>
          <Button onClick={sendOTP}>Enviar</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default AuthPage;