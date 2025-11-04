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
  ScrollArea,
  Drawer,
  Affix,
  Transition,
  Button,
  rem,
  ThemeIcon,
  Center,
  LoadingOverlay,
  Modal,
  Container,
} from "@mantine/core";
import {
  IconCheck,
  IconClipboardText,
  IconPlus,
  IconSend2,
  IconEye,
  IconPrinter,
} from "@tabler/icons-react";
import { nanoid as generateId } from "nanoid";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState, useRef } from "react";
import NotificacionChat from "./../../../components/mensajes/NotificacionChat";
import { useThrottledValue } from "@mantine/hooks";
import { useReactToPrint } from "react-to-print";

function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat();
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<Database["public"]["Tables"]["reports"]["Row"][]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [openedCreateReport, setOpenedCreateReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [disclaimerOpened, setDisclaimerOpened] = useState(true);
  const slowedMessages = useThrottledValue(messages, 500);

  const [reportModalOpened, setReportModalOpened] = useState(false);
  const [currentReport, setCurrentReport] = useState<Database["public"]["Tables"]["reports"]["Row"] | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const reactToPrint = useReactToPrint({ contentRef: reportRef });

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
      .eq("id", parseInt(reportId as unknown as string))
      .single();
    setMessages([
      {
        id: generateId(),
        role: "system",
        content: `${basePrompt}\n${
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

  function viewReport(report: Database["public"]["Tables"]["reports"]["Row"]) {
    setCurrentReport(report);
    setReportModalOpened(true);
  }

  return (
    <div style={{ width: "100%" }}>
      <NotificacionChat
        opened={disclaimerOpened}
        onClose={() => setDisclaimerOpened(false)}
      />
      <LoadingOverlay visible={loadingReport} />
      <Affix position={{ bottom: 600, right: -55 }}>
        <Transition transition="slide-up" mounted={!open}>
          {(transitionStyles) => (
            <Button
              leftSection={
                <IconClipboardText
                  style={{ transform: "rotate(90deg)", width: rem(16), height: rem(16) }}
                />
              }
              style={{ ...transitionStyles, transform: "rotate(270deg)" }}
              onClick={() => setOpen(true)}
            >
              Reportes
            </Button>
          )}
        </Transition>
      </Affix>

      <Stack style={{ height: "90dvh" }} mx={"xl"}>
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
                    borderColor: selectedReport === report.id.toString() ? "blue" : undefined,
                  }}
                >
                  <Group gap="apart">
                    <Group onClick={() => selectReport(report.id.toString())}>
                      <ThemeIcon color={selectedReport === report.id.toString() ? "blue" : "gray"}>
                        {selectedReport === report.id.toString() ? <IconCheck /> : <IconClipboardText />}
                      </ThemeIcon>
                      <Text>{`${report.created_at.split("T")[0]} a las ${report.created_at.split("T")[1].split(".")[0]}`}</Text>
                    </Group>
                    <Button
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewReport(report);
                      }}
                      rightSection={<IconEye size={16} />}
                    >
                      Ver Reporte
                    </Button>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
          <Button rightSection={<IconPlus />} w={"100%"} onClick={() => setOpenedCreateReport(true)}>
            Crear Reporte
          </Button>
        </Drawer>

        <Modal
          opened={reportModalOpened}
          onClose={() => setReportModalOpened(false)}
          title="Contenido del Reporte"
          size="xl"
        >
          {currentReport && (
            <>
              <Group mb={"md"} gap="right" mt="md">
                <Button onClick={()=>reactToPrint()} rightSection={<IconPrinter size={16} />}>
                  Imprimir / Guardar PDF
                </Button>
              </Group>
              <Container ref={reportRef}>
                <Container mx={"lg"}>
                  <MdRenderer content={currentReport.report} />
                </Container>
              </Container>
            </>
          )}
        </Modal>
        <ScrollArea h={"100dvh"} offsetScrollbars mt={"md"} w={"100%"}>
          <Group grow justify="center">
            <Group justify="center">
              <Stack mt={"xl"} w={"90%"} align="stretch" justify="center" style={{ alignSelf: "center" }}>
                {messages.length < 1 ? (
                  <Center>
                    <Text ta={"center"}>Escribele un mensaje a DataSalud IA para que te ayude</Text>
                  </Center>
                ) : null}
                  {slowedMessages.map((messages) => {
                    if (messages.role === "user") {
                      return (
                        <Group key={messages.id}>
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
                        <Group grow align="flex-end" key={messages.id}>
                          <Card
                            withBorder
                            w={"100%"}
                            style={{
                              maxWidthL: "50%",
                            }}
                            radius={"lg"}
                          >
                            <Group justify="space-between">
                              <Stack gap={0}>
                                <MdRenderer content={messages.content} />
                              </Stack>

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