import {
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Image,
  Center,
  Card,
} from "@mantine/core";
import wellfitLogo from "../../assets/wellfit-bottom-text.svg";
import classes from "./page.module.css";
import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [reloaded, setReloaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if the user is already logged in, reload the page due to the cookie setting on the first load
    (async () => {
      const user = await supabase.auth.getUser();
      if (user && !reloaded) {
        await navigate("/");
      }
      setLoading(false);
      setReloaded(true);
    })();
  }, []);

  async function handleLogin(email: string) {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    setLoading(false);
  }

  return (
    <Center
      style={{
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Card
        withBorder
        shadow="md"
        p={"xl"}
        style={{
          width: "40%",
        }}
      >
        <Group justify="center" align="center" grow>
          <Group w={"100%"} justify="center" align="center">
            <Title className={classes.title} ta="center">
              Bienvenido a DataSalud
            </Title>
            <Stack gap={0}>
              <Center>
                <Text fw={700} c={"dimmed"} ta={"center"}>
                  by
                </Text>
                <Image src={wellfitLogo} w={80} fit="contain" />
              </Center>
            </Stack>
            <Text c="dimmed" fz="sm" ta="center">
              Ingresa tu email para recibir un link de inicio de sesión
            </Text>
            <Card withBorder p={30} mt="xl" w={"100%"}>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Tu correo electrónico"
                placeholder="correo@ejemplo.com"
                required
              />
              <Group
                justify="space-between"
                mt="lg"
                className={classes.controls}
              >
                <Button
                  loading={loading}
                  w={"100%"}
                  className={classes.control}
                  onClick={() => handleLogin(email)}
                >
                  Enviame un Link
                </Button>
              </Group>
            </Card>
          </Group>
        </Group>
      </Card>
    </Center>
  );
}

export default AuthPage;
