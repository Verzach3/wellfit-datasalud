import MdRenderer from "@/components/chat/MdRenderer";
import type { Database } from "@/types/supabase";
import {
  Card,
  Stack,
  TextInput,
  Text,
  Group,
  Avatar,
  ActionIcon,
  Flex,
  ScrollArea,
  Drawer,
  Affix,
  Transition,
  Button,
  rem,
  ThemeIcon,
  Center,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconCheck,
  IconClipboardText,
  IconFileFilled,
  IconPlus,
  IconSend2,
} from "@tabler/icons-react";
import { generateId } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat();
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<
    Database["public"]["Tables"]["reports"]["Row"][]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [openedCreateReport, setOpenedCreateReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    (async () => {
      const reports = await supabase.from("reports").select("*");
      if (!reports.data) return;
      setReports(reports.data);
    })();

    (async () => {
      const files = await supabase.storage
        .from("patient-documents")
        .list(`${(await supabase.auth.getSession()).data.session?.user.id}`);
      if (!files.data) return;
      setFiles(files.data as unknown as File[]);
    })();
  }, []);

  async function selectReport(reportId: string) {
    if (selectedReport === reportId) return;
    setLoadingReport(true);
    const report = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();
    setMessages([
      {
        id: generateId(),
        role: "system",
        content: `${basePrompt}\n${
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          report.data!.report
        }`,
      },
      {
        id: generateId(),
        role: "assistant",
        content:
          "Hola, soy DataSalud IA, una IA que ayuda a pacientes con sus consultas sobre su salud",
      },
    ]);
    setSelectedReport(reportId);
    setLoadingReport(false);
  }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <LoadingOverlay visible={loadingReport} />
      <Affix position={{ bottom: 600, right: -55 }}>
        <Transition transition="slide-up" mounted={!open}>
          {(transitionStyles) => (
            <Button
              leftSection={
                <IconClipboardText
                  style={{
                    transform: "rotate(90deg)",
                    width: rem(16),
                    height: rem(16),
                  }}
                />
              }
              style={{
                ...transitionStyles,
                transform: "rotate(270deg)",
              }}
              onClick={() => setOpen(true)}
            >
              Reportes
            </Button>
          )}
        </Transition>
      </Affix>
      <Stack
        style={{
          height: "90dvh",
        }}
        mx={"xl"}
      >
        <Drawer
          opened={open}
          onClose={() => setOpen(false)}
          title="Reportes"
          position="right"
        >
          <Stack h={"88dvh"}>
            {reports.length < 1 ? (
              <Text ta={"center"} fw={700} mt={"md"}>
                No tienes reportes
              </Text>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  w={"100%"}
                  withBorder
                  style={{
                    borderColor:
                      selectedReport === report.id.toString()
                        ? "blue"
                        : undefined,
                  }}
                  onClick={() => selectReport(report.id.toString())}
                >
                  <Group>
                    <ThemeIcon
                      color={
                        selectedReport === report.id.toString()
                          ? "blue"
                          : "gray"
                      }
                    >
                      {selectedReport === report.id.toString() ? (
                        <IconCheck />
                      ) : (
                        <IconClipboardText />
                      )}
                    </ThemeIcon>
                    <Text>{`${report.created_at.split("T")[0]} a las ${
                      report.created_at.split("T")[1].split(".")[0]
                    }`}</Text>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
          <Button
            rightSection={<IconPlus />}
            w={"100%"}
            onClick={() => setOpenedCreateReport(true)}
          >
            Crear Reporte
          </Button>
        </Drawer>
        <Drawer
          opened={openedCreateReport}
          onClose={() => setOpenedCreateReport(false)}
          title="Crear Reporte"
          position="right"
        >
          {files.length <= 1 ? (
            <Text ta={"center"} fw={700} mt={"md"}>
              No tienes archivos
            </Text>
          ) : (
            files.map((file) => {
              if (file.name.startsWith(".")) return null;
              return (
                <Card key={file.name} w={"100%"} withBorder>
                  <Group>
                    <ThemeIcon color="gray">
                      <IconFileFilled />
                    </ThemeIcon>
                    <Text>{file.name}</Text>
                  </Group>
                </Card>
              );
            })
          )}
        </Drawer>
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
                {messages.length < 1 ? (
                  <Center>
                    <Text ta={"center"}>
                      Escribele un mensaje a DataSalud IA para que te ayude
                    </Text>
                  </Center>
                ) : null}
                {messages.map((messages) => {
                  if (messages.role === "user") {
                    return (
                      <Group>
                        <Card withBorder w={"fit-content"} radius={"lg"}>
                          <Group>
                            <Avatar />
                            <Text style={{ whiteSpace: "pre-wrap" }}>
                              {messages.content}
                            </Text>
                          </Group>
                        </Card>
                      </Group>
                    );
                  }
                  if (messages.role === "assistant") {
                    return (
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
                            <MdRenderer content={messages.content} />

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
                    );
                  }
                })}
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
          <form onSubmit={handleSubmit}>
            <TextInput
              variant="unstyled"
              autoFocus
              placeholder="Escribele algo a DataSalud IA"
              rightSection={
                <ActionIcon variant="transparent" c={"gray"} type="submit">
                  <IconSend2 />
                </ActionIcon>
              }
              value={input}
              onChange={handleInputChange}
            />
          </form>
        </Card>
      </Stack>
    </div>
  );
}

export default Chat;

const basePrompt = `
Eres DataSalud IA, una IA que pertenece a WellFit Clinics
y que ayuda a sus pacientes con recomendaciones y consejos sobre sus historias clinicas
tu tarea es dirigirte al usuario lo mejor posible y ayudarlo con sus consultas sobre su salud
y sus diagnosticos medicos, no respondas cosas que no tengan que ver con medicina o su salud

la historia de la consulta es la siguiente:


`;
