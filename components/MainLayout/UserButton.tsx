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
import classes from "./UserButton.module.css";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function UserButton() {
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        setError(true);
        return;
      }
      setUserData(user);
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
        <Avatar radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            Harriette Spoonlicker
          </Text>

          <Text c="dimmed" size="xs" truncate="end" w={"11rem"}>
            {userData.email}
          </Text>
        </div>

        <IconChevronRight
          style={{ width: rem(14), height: rem(14) }}
          stroke={1.5}
        />
      </Group>
    </UnstyledButton>
  );
}
