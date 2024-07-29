import React, { useState } from "react";
import {
  Button,
  Container,
  Image,
  Select,
  Text,
  TextInput,
  Title,
  Paper,
  Transition,
  Stack,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { motion } from "framer-motion";
import { IconUser, IconPhone, IconCalendar, IconGenderBigender } from '@tabler/icons-react';
import styles from "./page.module.css";

type ProfileType = {
  name: string;
  second_name?: string;
  lastname: string;
  second_lastname?: string;
  birth_date: Date;
  gender: "M" | "F";
  phone: string;
};

function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ProfileType>({
    initialValues: {
      name: "",
      second_name: "",
      lastname: "",
      second_lastname: "",
      birth_date: new Date(),
      gender: "M",
      phone: "",
    },
    validate: {
      name: (value) => (value.length > 2 ? null : "Nombre inválido"),
      lastname: (value) => (value.length > 2 ? null : "Apellido inválido"),
      gender: (value) => (value === "M" || value === "F" ? null : "Opción inválida"),
      phone: (value) => (/^\+?[0-9]{10,14}$/.test(value) ? null : "Número de teléfono inválido"),
    },
  });

  async function completeProfile(profile: ProfileType) {
    setLoading(true);
    await supabase.from("profiles").upsert({
      birth_date: profile.birth_date.toISOString().split("T")[0],
      gender: profile.gender,
      name: profile.name,
      first_lastname: profile.first_lastname,
      
      phone: profile.phone,
      lastname: profile.lastname,
    });
    try {
      // Simular una petición a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      notifications.show({
        title: "Perfil actualizado",
        message: "Tu perfil ha sido actualizado exitosamente",
        color: "green",
      });
      // Aquí iría la lógica para guardar el perfil
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Hubo un problema al actualizar tu perfil",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className={styles.formContainer} size="sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper shadow="md" p="xl" radius="lg" className={styles.formWrapper}>
          <Stack align="center" gap="lg">
            <Image 
              src="/assets/wellfit-bottom-text.svg" 
              height={100} 
              width="auto" 
              className={styles.logo}
            />
            <Title order={2} className={styles.title}>Completa tu Perfil</Title>
            <Text size="sm" color="dimmed" className={styles.subtitle}>
              Ayúdanos a conocerte mejor para brindarte una experiencia personalizada
            </Text>
            <form onSubmit={form.onSubmit((values) => completeProfile(values))}>
              <Stack gap="md">
                <TextInput
                  required
                  label="Nombre"
                  placeholder="Tu nombre"
                  leftSection={<IconUser size="1rem" />}
                  {...form.getInputProps('name')}
                  className={styles.input}
                />
                <TextInput
                  label="Segundo Nombre"
                  placeholder="Opcional"
                  {...form.getInputProps('second_name')}
                  className={styles.input}
                />
                <TextInput
                  required
                  label="Apellido"
                  placeholder="Tu apellido"
                  {...form.getInputProps('lastname')}
                  className={styles.input}
                />
                <TextInput
                  label="Segundo Apellido"
                  placeholder="Opcional"
                  {...form.getInputProps('second_lastname')}
                  className={styles.input}
                />
                <DateInput
                  required
                  label="Fecha de Nacimiento"
                  placeholder="Selecciona tu fecha de nacimiento"
                  leftSection={<IconCalendar size="1rem" />}
                  {...form.getInputProps('birth_date')}
                  className={styles.input}
                />
                <Select
                  required
                  label="Género"
                  placeholder="Selecciona tu género"
                  data={[
                    { value: 'M', label: 'Masculino' },
                    { value: 'F', label: 'Femenino' },
                  ]}
                  leftSection={<IconGenderBigender size="1rem" />}
                  {...form.getInputProps('gender')}
                  className={styles.input}
                />
                <TextInput
                  required
                  label="Teléfono"
                  placeholder="Tu número de teléfono"
                  leftSection={<IconPhone size="1rem" />}
                  {...form.getInputProps('phone')}
                  className={styles.input}
                />
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                  className={styles.submitButton}
                >
                  {loading ? "Actualizando..." : "Completar Perfil"}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
}

export default ProfileForm;