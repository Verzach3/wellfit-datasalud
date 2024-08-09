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
import {
  IconUser,
  IconPhone,
  IconCalendar,
  IconGenderBigender,
  IconBadge,
  IconIdBadge2,
} from "@tabler/icons-react";
import styles from "./page.module.css";
import { navigate } from "vike/client/router";

type ProfileType = {
  name: string;
  second_name?: string;
  lastname: string;
  second_lastname?: string;
  birth_date: Date;
  gender: "M" | "F";
  phone: string;
  cedula: string;
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
      cedula: "",
    },
    validate: {
      name: (value) => (value.length > 2 ? null : "Nombre inválido"),
      lastname: (value) => (value.length > 2 ? null : "Apellido inválido"),
      gender: (value) =>
        value === "M" || value === "F" ? null : "Opción inválida",
      phone: (value) =>
        /^\+?[0-9]{10,14}$/.test(value) ? null : "Número de teléfono inválido",
      cedula: (value) =>
        value.length > 2 ? null : "Número de cedula inválido",
    },
  });

  async function completeProfile(profile: ProfileType) {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    if (!data || !data.user) {
      notifications.show({
        title: "Error",
        message: "No has iniciado sesión",
        color: "red",
      });
      return;
    }
    try {
      await supabase.from("profiles").upsert({
        birth_date: profile.birth_date.toISOString().split("T")[0],
        gender: profile.gender,
        first_name: profile.name,
        second_name: profile.second_name,
        first_lastname: profile.lastname,
        second_lastname: profile.second_lastname,
        phone: profile.phone,
        cedula: profile.cedula,
        user_id: data.user.id,
      }).then(() => {
        navigate("/");
      });
      notifications.show({
        title: "Perfil actualizado",
        message: "Tu perfil ha sido actualizado exitosamente",
        color: "green",
      });
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
            <Title order={2} className={styles.title}>
              Completa tu Perfil
            </Title>
            <Text size="sm" color="dimmed" className={styles.subtitle}>
              Ayúdanos a conocerte mejor para brindarte una experiencia
              personalizada
            </Text>
            <form onSubmit={form.onSubmit((values) => completeProfile(values))}>
              <Stack gap="xl">
                <TextInput
                  required
                  label="Nombre"
                  placeholder="Tu nombre"
                  leftSection={<IconUser size="1rem" />}
                  {...form.getInputProps("name")}
                  className={styles.input}
                />
                <TextInput
                  label="Segundo Nombre"
                  placeholder="Opcional"
                  {...form.getInputProps("second_name")}
                  className={styles.input}
                />
                <TextInput
                  required
                  label="Apellido"
                  placeholder="Tu apellido"
                  {...form.getInputProps("lastname")}
                  className={styles.input}
                />
                <TextInput
                  label="Segundo Apellido"
                  placeholder="Opcional"
                  {...form.getInputProps("second_lastname")}
                  className={styles.input}
                />
                <DateInput
                  required
                  label="Fecha de Nacimiento"
                  placeholder="Selecciona tu fecha de nacimiento"
                  leftSection={<IconCalendar size="1rem" />}
                  {...form.getInputProps("birth_date")}
                  className={styles.input}
                />
                <Select
                  required
                  label="Género"
                  placeholder="Selecciona tu género"
                  data={[
                    { value: "M", label: "Masculino" },
                    { value: "F", label: "Femenino" },
                  ]}
                  leftSection={<IconGenderBigender size="1rem" />}
                  {...form.getInputProps("gender")}
                  className={styles.input}
                />
                <TextInput
                  required
                  label="Teléfono"
                  placeholder="Tu número de teléfono"
                  leftSection={<IconPhone size="1rem" />}
                  {...form.getInputProps("phone")}
                  className={styles.input}
                />
                <TextInput
                  required
                  label="Cedula"
                  placeholder="Tu número de cedula"
                  leftSection={<IconIdBadge2 size="1rem" />}
                  {...form.getInputProps("cedula")}
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
