import type { Database } from "@/types/supabase";
import {
  Avatar,
  TextInput,
  Card,
  Center,
  Container,
  Group,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";

function AccountPage() {

  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").limit(1).single();
      setProfile(data);
    })()
  })

  if (!profile) return <LoadingOverlay visible />;

  return (
    <Container mt={"md"}>
      <Card withBorder h={"85dvh"} shadow="lg">
        <Center mt={"md"}>
          <Avatar size={"xl"} />
        </Center>
        <Center mt={"md"} w={"100%"}>
          <Stack>
            <Group justify="space-between">
              <TextInput label="Nombre" value={profile.first_name} />
              <TextInput label="Segundo Nombre" value={profile.second_name || ""} />
            </Group>
            <Group mt={"md"}>
              <TextInput label="Apellido" value={profile.first_lastname} />
              <TextInput label="Segundo Apellido" value={profile.second_lastname || ""} />
            </Group>
            <Group mt={"md"}>
              <TextInput label="Fecha de Nacimiento" value={profile.birth_date} />
              <TextInput label="Genero" value={profile.gender} />
            </Group>
            <Group mt={"md"}>
              <TextInput label="Teléfono" value={profile.phone || ""} />
              <TextInput label="Cedula" value={profile.cedula || ""} />
            </Group>
          </Stack>
        </Center>
      </Card>
    </Container>
  );
}

export default AccountPage;
