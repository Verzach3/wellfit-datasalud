import {
  Card,
  Container,
  Input,
  Stack,
  TextInput,
  Text,
  Group,
  Avatar,
  Center,
  ActionIcon,
  Flex,
  Image,
  ScrollArea,
} from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";

function Chat() {
  return (
    <Stack
      style={{
        height: "100dvh",
      }}
      mx={"xl"}
    >
      <ScrollArea h={"100dvh"} offsetScrollbars mt={"md"} w={"100%"}>
        <Group grow justify="center">
          <Group justify="center">
            <Stack
              mt={"xl"}
              w={"90%"}
              align="stretch"
              justify="center"
              style={{
                alignSelf: "center",
              }}
            >
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
                  <Group justify="space-between">
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis malesuada, mauris vitae mollis tincidunt, felis magna
                      hendrerit dui, nec bibendum nulla augue et eros. Etiam
                      posuere lorem in nunc mattis aliquam. Nullam dictum non
                      neque tempus posuere. Fusce rutrum ipsum sed lacus
                      facilisis, quis porttitor ante elementum. Morbi ipsum
                      enim, tincidunt quis mattis eget, sollicitudin in nunc.
                      Integer nec libero aliquet, faucibus risus eget, pharetra
                      eros. Mauris consequat dui justo, ut imperdiet turpis
                      consectetur vestibulum. In hac habitasse platea dictumst.
                      Nulla facilisi. Quisque odio arcu, hendrerit quis eros ac,
                      ornare convallis odio. Nunc eget finibus mauris, quis
                      volutpat purus. Nunc sodales facilisis felis, eu consequat
                      enim mattis ultrices. Praesent sodales sem ut urna tempor,
                      eu elementum lorem egestas. Vestibulum sed posuere nunc,
                      ac feugiat lorem. Cras enim sem, porttitor et tristique
                      nec, tristique quis urna. Quisque id sem at sapien mollis
                      mollis quis vel velit. Pellentesque elit risus, euismod
                      vitae semper eget, venenatis id lorem. Nunc at eleifend
                      dolor, vel aliquam orci. In nec pulvinar lectus. Integer
                      fringilla a turpis sit amet laoreet. Vivamus feugiat nisl
                      id laoreet facilisis. Vestibulum eget maximus nisi.
                      Integer nec diam eget neque mollis luctus et mollis dolor.
                      Duis eget risus arcu. Integer at auctor ipsum. Sed a
                      consectetur lacus. Donec faucibus condimentum libero,
                      consequat placerat est tempus aliquam. Nullam non magna
                      vitae purus accumsan volutpat. Sed venenatis risus porta
                      elit porta, at porta justo porta. Donec non tortor
                      hendrerit, porta neque quis, tincidunt lorem. Aenean at
                      vulputate dolor. Cras mattis, sem eu tristique molestie,
                      purus dolor euismod justo, vestibulum sodales nisl augue
                      id nunc. Donec diam risus, mattis non libero a, commodo
                      auctor ante. Pellentesque sollicitudin posuere lacus at
                      congue. Quisque semper congue tellus. Pellentesque quis
                      ullamcorper nisi. Cras lacinia, diam quis rhoncus pretium,
                      dolor felis dictum neque, et venenatis nibh nisi ut nisi.
                      Vestibulum facilisis mattis est, vel posuere justo sodales
                      at. Aliquam a venenatis nisl, laoreet pretium massa. Duis
                      et interdum massa. Nam semper lacinia fringilla. Sed sed
                      risus sit amet mauris sollicitudin hendrerit. Aenean
                      pellentesque sit amet velit convallis ultrices. Etiam enim
                      nunc, pellentesque ac neque a, iaculis venenatis justo.
                      Morbi non lacus in lectus facilisis pulvinar. Vestibulum
                      sit amet quam felis. Mauris ac lacus fermentum, iaculis
                      metus id, lacinia nisl. Suspendisse fringilla consequat
                      diam vel dictum. Praesent fermentum sapien nibh, vel
                      tincidunt est interdum vitae. Maecenas viverra sagittis
                      gravida. Donec accumsan ullamcorper tortor, et rutrum
                      nulla varius sit amet. Donec scelerisque pharetra metus,
                      nec dignissim est blandit vel. Nullam nec metus ligula.
                      Suspendisse at enim mauris.
                    </Text>
                    <div
                      style={{
                        flexGrow: 1,
                      }}
                    >
                      <Flex
                        justify={"flex-end"}
                        style={{
                          width: "100%",
                        }}
                      >
                        <Avatar />
                      </Flex>
                    </div>
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
                  <Group justify="space-between">
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis malesuada, mauris vitae mollis tincidunt, felis magna
                      hendrerit dui, nec bibendum nulla augue et eros. Etiam
                      posuere lorem in nunc mattis aliquam. Nullam dictum non
                      neque tempus posuere. Fusce rutrum ipsum sed lacus
                      facilisis, quis porttitor ante elementum. Morbi ipsum
                      enim, tincidunt quis mattis eget, sollicitudin in nunc.
                      Integer nec libero aliquet, faucibus risus eget, pharetra
                      eros. Mauris consequat dui justo, ut imperdiet turpis
                      consectetur vestibulum. In hac habitasse platea dictumst.
                      Nulla facilisi. Quisque odio arcu, hendrerit quis eros ac,
                      ornare convallis odio. Nunc eget finibus mauris, quis
                      volutpat purus. Nunc sodales facilisis felis, eu consequat
                      enim mattis ultrices. Praesent sodales sem ut urna tempor,
                      eu elementum lorem egestas. Vestibulum sed posuere nunc,
                      ac feugiat lorem. Cras enim sem, porttitor et tristique
                      nec, tristique quis urna. Quisque id sem at sapien mollis
                      mollis quis vel velit. Pellentesque elit risus, euismod
                      vitae semper eget, venenatis id lorem. Nunc at eleifend
                      dolor, vel aliquam orci. In nec pulvinar lectus. Integer
                      fringilla a turpis sit amet laoreet. Vivamus feugiat nisl
                      id laoreet facilisis. Vestibulum eget maximus nisi.
                      Integer nec diam eget neque mollis luctus et mollis dolor.
                      Duis eget risus arcu. Integer at auctor ipsum. Sed a
                      consectetur lacus. Donec faucibus condimentum libero,
                      consequat placerat est tempus aliquam. Nullam non magna
                      vitae purus accumsan volutpat. Sed venenatis risus porta
                      elit porta, at porta justo porta. Donec non tortor
                      hendrerit, porta neque quis, tincidunt lorem. Aenean at
                      vulputate dolor. Cras mattis, sem eu tristique molestie,
                      purus dolor euismod justo, vestibulum sodales nisl augue
                      id nunc. Donec diam risus, mattis non libero a, commodo
                      auctor ante. Pellentesque sollicitudin posuere lacus at
                      congue. Quisque semper congue tellus. Pellentesque quis
                      ullamcorper nisi. Cras lacinia, diam quis rhoncus pretium,
                      dolor felis dictum neque, et venenatis nibh nisi ut nisi.
                      Vestibulum facilisis mattis est, vel posuere justo sodales
                      at. Aliquam a venenatis nisl, laoreet pretium massa. Duis
                      et interdum massa. Nam semper lacinia fringilla. Sed sed
                      risus sit amet mauris sollicitudin hendrerit. Aenean
                      pellentesque sit amet velit convallis ultrices. Etiam enim
                      nunc, pellentesque ac neque a, iaculis venenatis justo.
                      Morbi non lacus in lectus facilisis pulvinar. Vestibulum
                      sit amet quam felis. Mauris ac lacus fermentum, iaculis
                      metus id, lacinia nisl. Suspendisse fringilla consequat
                      diam vel dictum. Praesent fermentum sapien nibh, vel
                      tincidunt est interdum vitae. Maecenas viverra sagittis
                      gravida. Donec accumsan ullamcorper tortor, et rutrum
                      nulla varius sit amet. Donec scelerisque pharetra metus,
                      nec dignissim est blandit vel. Nullam nec metus ligula.
                      Suspendisse at enim mauris.
                    </Text>
                    <div
                      style={{
                        flexGrow: 1,
                      }}
                    >
                      <Flex
                        justify={"flex-end"}
                        style={{
                          width: "100%",
                        }}
                      >
                        <Avatar />
                      </Flex>
                    </div>
                  </Group>
                </Card>
              </Group>
            </Stack>
          </Group>
        </Group>
      </ScrollArea>
      <Card
        withBorder
        pt={"xs"}
        w={"100%"}
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <TextInput
          variant="unstyled"
          autoFocus
          placeholder="Escribele algo a DataSalud IA"
          rightSection={
            <ActionIcon variant="transparent" c={"gray"}>
              <IconSend2 />
            </ActionIcon>
          }
        />
      </Card>
    </Stack>
  );
}

export default Chat;
