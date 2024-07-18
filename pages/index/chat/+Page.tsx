import {
  Card,
  Container,
  Input,
  Stack,
  TextInput,
  Text,
  Group,
  Avatar,
} from "@mantine/core";

function Chat() {
  return (
    <Stack
      style={{
        height: "100dvh",
      }}
      justify="space-between"
      mx={"10rem"}
    >
      <Stack mt={"xl"} w={"100%"}>
        <Group>
          <Card withBorder w={"fit-content"} radius={"lg"}>
            <Group>
              <Avatar />
              <Text>Hola, Como estas?</Text>
            </Group>
          </Card>
        </Group>
        <Group grow align="flex-end">
          <Card
            withBorder
            w={"fit-content"}
            style={{
              maxWidthL: "50%",
            }}
            radius={"lg"}
          >
            <Group>
              <Avatar />
              <Text>Hola, Como estas?</Text>
            </Group>
          </Card>
        </Group>
      </Stack>
      <Card withBorder mx={"md"} mb={"sm"} p={0}>
        <TextInput />
      </Card>
    </Stack>
  );
}

export default Chat;
