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
  Transition,
  LoadingOverlay,
} from "@mantine/core";
import { motion } from 'framer-motion';
import { IconMail } from '@tabler/icons-react';
import wellfitLogo from "../../assets/wellfit-bottom-text.svg";
import classes from "./page.module.css";
import { navigate } from "vike/client/router";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking user...");
        const { data: { user } } = await supabase.auth.getUser();
        console.log("User data:", user);
        if (user) {
          console.log("User found, navigating...");
          await navigate("/");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  async function handleLogin(email: string) {
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
      // we might want to show a success message to the user here
    } catch (error) {
      console.error("Error sending OTP:", error);
      // we might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    console.log("Rendering loading overlay");
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      </div>
    );
  }

  console.log("Rendering main component");
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
              </Card>
            </Stack>
          </motion.div>
        </Card>
      </Container>
    </div>
  );
}

export default AuthPage;