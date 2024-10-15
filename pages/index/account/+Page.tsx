import React, { useEffect, useState } from 'react';
import type { Database } from "@/types/supabase";
import {
  Avatar,
  TextInput,
  Card,
  Container,
  Group,
  Stack,
  LoadingOverlay,
  Title,
  Text,
  Button,
  Divider,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCamera, IconEdit, IconUpload } from '@tabler/icons-react';
import classes from './page.module.css';

function AccountPage() {
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").limit(1).single();
      setProfile(data);
    })()
  }, []);

  const handleImageUpload = async (files: File[]) => {
    // Implement image upload logic here
    console.log('Image uploaded:', files[0]);
  };

  if (!profile) return <LoadingOverlay visible />;

  return (
    <Container size="md" className={classes.container}>
      <Card withBorder shadow="md" radius="lg" className={classes.card}>
        <Group gap="apart" mb="xl">
          <Title order={2}>Perfil de Usuario</Title>
          <Button
            variant="light"
            onClick={() => setIsEditing(!isEditing)}
            leftSection={<IconEdit size={20} />}
          >
            {isEditing ? 'Guardar' : 'Editar'}
          </Button>
        </Group>

        <Group gap="center" mb="xl">
          <Dropzone
            onDrop={handleImageUpload}
            accept={IMAGE_MIME_TYPE}
            multiple={false}
            radius="xl"
            className={classes.avatarDropzone}
          >
            <Avatar
              size={120}
              className={classes.avatar}
            />
            <ActionIcon
              color="blue"
              variant="filled"
              size="lg"
              radius="xl"
              className={classes.avatarOverlay}
            >
              <IconCamera size={20} />
            </ActionIcon>
          </Dropzone>
        </Group>

        <Divider my="lg" />

        <Stack gap="md">
          <Group grow>
            <TextInput
              label="Nombre"
              value={profile.first_name}
              disabled={!isEditing}
              className={classes.input}
            />
            <TextInput
              label="Segundo Nombre"
              value={profile.second_name || ""}
              disabled={!isEditing}
              className={classes.input}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Apellido"
              value={profile.first_lastname}
              disabled={!isEditing}
              className={classes.input}
            />
            <TextInput
              label="Segundo Apellido"
              value={profile.second_lastname || ""}
              disabled={!isEditing}
              className={classes.input}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Fecha de Nacimiento"
              value={profile.birth_date}
              disabled={!isEditing}
              className={classes.input}
            />
            <TextInput
              label="Género"
              value={profile.gender}
              disabled={!isEditing}
              className={classes.input}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Teléfono"
              value={profile.phone || ""}
              disabled={!isEditing}
              className={classes.input}
            />
            <TextInput
              label="Cédula"
              value={profile.cedula || ""}
              disabled={!isEditing}
              className={classes.input}
            />
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}

export default AccountPage;