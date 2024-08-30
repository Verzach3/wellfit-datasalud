import React, { useEffect, useState } from 'react';
import { getFolderFiles } from "@/functions/getFolderFiles.telefunc";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Transition,
  Loader,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronDown,
  IconDownload,
  IconFilePlus,
  IconFile,
} from "@tabler/icons-react";
import type { FileObject } from "@supabase/storage-js";
import { generateDownload } from "@/functions/generateDownload.telefunc";
import { addReport } from "@/functions/addReport.telefunc";
import classes from './UserFiles.module.css';

type UserFilesProps = {
  name: string;
  lastname: string;
  birth_date: string;
  cedula: string;
  folder_name: string;
};

function UserFiles({
  name,
  lastname,
  birth_date,
  cedula,
  folder_name,
}: UserFilesProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [report, setReport] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileDetail, setFileDetail] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingReport, setAddingReport] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const filesRes = await getFolderFiles(folder_name);
      if (filesRes.error) {
        console.log(filesRes.error);
      } else {
        setFiles(filesRes.data.filter((file) => file.name.endsWith(".pdf")));
      }
      setLoading(false);
    };
    fetchFiles();
  }, [folder_name]);

  const handleAddReport = async () => {
    setAddingReport(true);
    await addReport(report, folder_name);
    setModalOpened(false);
    setReport("");
    setFileName("");
    setFileDetail("");
    setIsPaid(false);
    setAddingReport(false);
  };

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
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Agregar Reporte"
        size="lg"
        classNames={{ title: classes.modalTitle, body: classes.modalBody }}
      >
        <TextInput
          label="Nombre del archivo"
          placeholder="Ingrese el nombre del archivo"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className={classes.modalInput}
          required
        />
        <TextInput
          label="Detalle del archivo"
          placeholder="Ingrese detalles sobre el archivo"
          value={fileDetail}
          onChange={(e) => setFileDetail(e.target.value)}
          className={classes.modalInput}
          required
        />
        <Textarea
          label="Reporte"
          placeholder="Escribe aquí el reporte"
          value={report}
          onChange={(e) => setReport(e.target.value)}
          minRows={5}
          maxRows={10}
          className={classes.modalInput}
          required
        />
        <Checkbox
          label="El paciente ha pagado Data Salud"
          checked={isPaid}
          onChange={(e) => setIsPaid(e.target.checked)}
          className={classes.modalCheckbox}
        />
        <Button
          onClick={handleAddReport}
          loading={addingReport}
          className={classes.addButton}
          fullWidth
        >
          Agregar Reporte
        </Button>
      </Modal>

      <Card className={classes.userFileCard}>
        <Group justify="space-between" className={classes.cardHeader}>
          <div>
            <Title order={3} className={classes.userName}>{`${name} ${lastname}`}</Title>
            <Text size="sm" className={classes.userInfo}>Fecha de nacimiento: {birth_date}</Text>
            <Text size="sm" className={classes.userInfo}>Cédula: {cedula}</Text>
          </div>
          <Group>
            <Tooltip label="Subir reporte del paciente" withArrow position="top">
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
                <IconChevronDown size={20} className={collapsed ? classes.rotated : ''} />
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
                        <Button
                          variant="light"
                          leftSection={<IconDownload size={16} />}
                          onClick={() => handleDownload(file.name)}
                          className={classes.downloadButton}
                        >
                          Descargar
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Text ta="center" color="dimmed">No hay archivos disponibles</Text>
              )}
            </Box>
          )}
        </Transition>
      </Card>
    </>
  );
}

export default UserFiles;