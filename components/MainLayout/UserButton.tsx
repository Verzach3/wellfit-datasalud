import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  rem,
  Loader,
  Container,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import classes from "./UserButton.module.css";
import type { Database } from "@/types/supabase";

export function UserButton() {
  const [userData, setUserData] = useState<User | null>(null);
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        setError(true);
        return;
      }
      setUserData(user);
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id);
      if (data && data.length === 0 || !data) {
        setProfile(null);
        return;
      }
      setProfile(data[0]);
    })();
  }, []);
  if (!userData) {
    return (
      <Container my={"lg"}>
        <Group>
          <Loader type="dots" size={"sm"} />
          <Text size="sm">Cargando datos de usuario...</Text>
        </Group>
      </Container>
    );
  }
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar radius="xl" color="blue" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {profile?.first_name}
          </Text>

          <Text c="dimmed" size="xs" truncate="end" w={"11rem"}>
            {userData.email}
          </Text>
        </div>

      </Group>
    </UnstyledButton>
  );
}
