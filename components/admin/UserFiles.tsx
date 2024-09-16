import { useEffect, useState } from "react";
import { getFolderFiles } from "@/functions/getFolderFiles.telefunc";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  Transition,
  Loader,
  Tooltip,
  Select,
  ThemeIcon,
  Badge,
} from "@mantine/core";
import {
  IconChevronDown,
  IconDownload,
  IconFilePlus,
  IconFile,
  IconFileSearch,
} from "@tabler/icons-react";
import type { FileObject } from "@supabase/storage-js";
import { generateDownload } from "@/functions/generateDownload.telefunc";
import { addReport } from "@/functions/addReport.telefunc";
import classes from "./UserFiles.module.css";
import { changeFileStatus } from "@/functions/changeFileStatus.telefunc";
import type { FileStatus } from "@/types/fileStatus";
import { notifications } from "@mantine/notifications";
import MDEditor from "@uiw/react-md-editor";
import { getPatientReports } from "@/functions/getPatientReports.telefunc";
import type { Report } from "@/types/report";
import { updateReport } from "@/functions/updateReport.telefunc";
import { useForceUpdate } from "@mantine/hooks";

type UserFilesProps = {
  name: string;
  lastname: string;
  birth_date: string;
  cedula: string;
  folder_name: string;
  file_status?: string;
  user_id?: string;
  file_id?: string;
  organization?: string;
};

function UserFiles({
  name,
  lastname,
  birth_date,
  cedula,
  folder_name,
  file_status,
  user_id,
  organization,
  file_id,
}: UserFilesProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [reportText, setReportText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingReport, setAddingReport] = useState(false);
  const [fileStatus, setFileStatus] = useState(file_status ?? "Recibido");
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [reportModalOpened, setReportModalOpened] = useState(false);
  const [updatingReport, setUpdatingReport] = useState(false);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const filesRes = await getFolderFiles(folder_name);
      if (filesRes.error) {
        console.log(filesRes.error);
      } else {
        setFiles(filesRes.data.filter((file) => file.name.endsWith(".pdf")));
      }

      const reportsRes = await getPatientReports(user_id ?? "");
      if (reportsRes.error) {
        console.log(reportsRes.error);
      } else {
        setReports(reportsRes.data ?? []);
      }
      setLoading(false);
    };
    fetchFiles();
  }, [folder_name, user_id]);

  const handleAddReport = async () => {
    if (updatingReport) {
      if (!currentReport) {
        notifications.show({
          title: "Error",
          message: "No se pudo actualizar el reporte, el reporte no existe",
          color: "red",
        });
        return;
      }
      if (!user_id) {
        notifications.show({
          title: "Error",
          message: "No se pudo actualizar el reporte, el userID no es valido",
          color: "red",
        });
        return;
      }
      await updateReport({
        id: currentReport.id,
        report: reportText,
        report_name: fileName,
        user_id: user_id,
        created_at: currentReport.created_at,
      });
      cleanup();
      return;
    }
    setAddingReport(true);
    await addReport(reportText, folder_name, fileName);
    setAddingReport(false);
    cleanup();
  };

  function cleanup() {
    setReportModalOpened(false);
    setCurrentReport(null);
    setReportText("");
    setFileName("");
    forceUpdate();
  }

  const handleDownload = async (fileName: string) => {
    const link = await generateDownload(`${folder_name}/${fileName}`);
    if ("error" in link) {
      console.log(link.error);
      return;
    }
    window.open(link.signedUrl, "_blank");
  };

  return (
    <>
      <Modal
        opened={reportModalOpened}
        onClose={() => {
          setReportModalOpened(false);
          cleanup();
        }}
        title="Reportes del paciente"
        withCloseButton={false}
      >
        <Stack>
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card withBorder key={report.id}>
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="gray" size="md" radius="0">
                      <IconFile />
                    </ThemeIcon>
                    <Text>
                      {report.report_name ?? report.created_at.split("T")[0]}
                    </Text>
                  </Group>
                  <Group>
                    <Button
                      onClick={() => {
                        setModalOpened(true);
                        setReportText(report.report);
                        setCurrentReport(report);
                        setFileName(report.report_name ?? "");
                        setUpdatingReport(true);
                      }}
                    >
                      Ver Reporte
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))
          ) : (
            <Text ta="center" c="dimmed">
              No hay reportes disponibles
            </Text>
          )}
        </Stack>
      </Modal>
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          cleanup();
        }}
        title="Agregar Reporte"
        size="lg"
        classNames={{ title: classes.modalTitle, body: classes.modalBody }}
        fullScreen
        styles={{
          body: {
            height: "80dvh",
          },
        }}
      >
        <TextInput
          label="Nombre del reporte"
          placeholder="Ingrese el nombre del reporte"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className={classes.modalInput}
          required
        />
        <MDEditor
          height={"100%"}
          value={reportText}
          onChange={(e) => setReportText(e ?? "")}
        />

        <Button
          onClick={handleAddReport}
          loading={addingReport}
          className={classes.addButton}
          fullWidth
          mt={"md"}
        >
          Agregar Reporte
        </Button>
      </Modal>

      <Card className={classes.userFileCard}>
        <Group justify="space-between" className={classes.cardHeader}>
          <div>
            <Title
              order={3}
              className={classes.userName}
            >{`${name} ${lastname}`}</Title>
            <Text size="sm" className={classes.userInfo}>
              Fecha de nacimiento: {birth_date}
            </Text>
            <Text size="sm" className={classes.userInfo}>
              Cédula: {cedula}
            </Text>
            <Group>
              <Text size="sm" className={classes.userInfo}>
                Organización:
              </Text>
              <Badge color="green">{organization}</Badge>
            </Group>
          </div>
          <Group>
            <Tooltip label="Ver reportes del paciente" withArrow position="top">
              <ActionIcon
                variant="filled"
                onClick={() => setReportModalOpened(true)}
                className={classes.actionIcon}
              >
                <IconFileSearch size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label="Subir reporte del paciente"
              withArrow
              position="top"
            >
              <ActionIcon
                variant="filled"
                onClick={() => setModalOpened(true)}
                className={classes.actionIcon}
              >
                <IconFilePlus size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Desplegar archivos" withArrow position="top">
              <ActionIcon
                variant="filled"
                onClick={() => setCollapsed(!collapsed)}
                className={classes.actionIcon}
              >
                <IconChevronDown
                  size={20}
                  className={collapsed ? classes.rotated : ""}
                />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Transition transition="slide-down" duration={300} mounted={collapsed}>
          {(styles) => (
            <Box style={styles} className={classes.fileList}>
              {loading ? (
                <Group justify="center" className={classes.loaderContainer}>
                  <Loader color="blue" />
                </Group>
              ) : files.length > 0 ? (
                <Stack gap="xs">
                  {files.map((file) => (
                    <Card key={file.name} className={classes.fileItem}>
                      <Group justify="space-between">
                        <Group>
                          <IconFile size={20} className={classes.fileIcon} />
                          <Text className={classes.fileName}>{file.name}</Text>
                        </Group>
                        <Group>
                          <Select
                            data={["Recibido", "En proceso", "Revisado"]}
                            value={fileStatus ?? "Recibido"}
                            onChange={(value) => {
                              if (!user_id) {
                                notifications.show({
                                  title: "Error",
                                  message:
                                    "No se pudo cambiar el estado del archivo",
                                  color: "red",
                                });
                                return;
                              }
                              try {
                                changeFileStatus(
                                  file.name,
                                  value as FileStatus,
                                  user_id
                                ).then((res) => {
                                  if (res.error) {
                                    console.log(res.error);
                                  } else {
                                    setFileStatus(value as FileStatus);
                                  }
                                });
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                            allowDeselect={false}
                          />
                          <Button
                            variant="light"
                            leftSection={<IconDownload size={16} />}
                            onClick={() => handleDownload(file.name)}
                            className={classes.downloadButton}
                          >
                            Descargar
                          </Button>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Text ta="center" c="dimmed">
                  No hay archivos disponibles
                </Text>
              )}
            </Box>
          )}
        </Transition>
      </Card>
    </>
  );
}

export default UserFiles;
