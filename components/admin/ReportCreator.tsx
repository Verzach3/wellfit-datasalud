import { getFilesText } from "@/functions/getFilesText.telefunc";
import {
  Text,
  Card,
  Center,
  Checkbox,
  Container,
  Drawer,
  Group,
  Loader,
  SimpleGrid,
  ThemeIcon,
  Title,
  Stack,
  Textarea,
  Button,
} from "@mantine/core";
import type { FileObject } from "@supabase/storage-js";
import { IconFile } from "@tabler/icons-react";
import { useRef, useState } from "react";
import MdRenderer from "../chat/MdRenderer";
import { useCompletion } from "ai/react";
import styles from "./RepotCreator.module.css";

export function ReportCreator({
  open,
  onClose,
  files,
  folderName,
}: {
  open: boolean;
  onClose: () => void;
  files: FileObject[];
  folderName: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([]);
  const [filesText, setFilesText] = useState("");
  const [loadingFilesText, setLoadingFilesText] = useState(false);
  const [showReportSection, setShowReportSection] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [observations, setObservations] = useState("");
  const { complete, completion, setCompletion } = useCompletion();
  const contentRef = useRef(null);

  const generateReport = async () => {
    setLoadingFilesText(true);
    setShowReportSection(true); // Muestra el reporte y el formulario
    const report = await getFilesText(folderName, selectedFiles);
    setFilesText(report);
    complete(report);
    setLoadingFilesText(false);
  };

  const handleValidateReport = () => {
    const reportData = {
      reportText: completion,
      feedback,
      observations,
    };
    console.log("Reporte Validado:", reportData);
    onClose();
  };

  return (
    <Drawer
      position="bottom"
      title={<div className={styles.drawerTitle}>Reporte de datos</div>}
      opened={open}
      onClose={() => {
        setShowReportSection(false); // Restablece la vista para selección de archivos
        setFilesText("");
        setCompletion("");
        onClose();
      }}
      size="xl"
      padding="md"
      className={styles.drawer}
    >
      {!showReportSection ? (
        // Vista de Selección de Archivos
        <Container>
          <Title order={4}>Selecciona Archivos</Title>
          <SimpleGrid cols={2} spacing="md" className={styles.fileGrid}>
            {files.map((file) => (
              <Card key={file.name} withBorder className={styles.fileCard}>
                <div className={styles.fileCardContent}>
                  <Checkbox
                    onClick={() => {
                      if (selectedFiles.includes(file)) {
                        setSelectedFiles(selectedFiles.filter((f) => f !== file));
                      } else {
                        setSelectedFiles([...selectedFiles, file]);
                      }
                    }}
                  />
                  <span className={styles.fileName}>{file.name}</span>
                  <ThemeIcon variant="white">
                    <IconFile />
                  </ThemeIcon>
                </div>
              </Card>
            ))}
          </SimpleGrid>
          <Button
            onClick={generateReport}
            disabled={selectedFiles.length === 0}
            fullWidth
            mt="md"
          >
            Siguiente
          </Button>
        </Container>
      ) : (
        // Vista de Generación de Reporte y Retroalimentación
        <SimpleGrid cols={2} spacing="lg" className={styles.contentGrid}>
          {/* Columna del Reporte Generado */}
          <Container ref={contentRef} className={styles.reportContainer}>
            <Title order={4}>Reporte Generado</Title>
            {loadingFilesText ? (
              <Center>
                <Stack>
                  <Loader size="xl" color="blue" />
                  <Text>Analizando Archivos</Text>
                </Stack>
              </Center>
            ) : (
              <MdRenderer content={completion} />
            )}
          </Container>

          {/* Columna del Formulario de Retroalimentación */}
          <Container className={styles.feedbackContainer}>
            <Title order={4}>Retroalimentación del Doctor</Title>
            <Textarea
              placeholder="Comentarios o sugerencias"
              label="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              autosize
              minRows={4}
              className={styles.feedbackInput}
            />
            <Textarea
              placeholder="Observaciones adicionales"
              label="Observaciones"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              autosize
              minRows={4}
              className={styles.feedbackInput}
            />
            <Button fullWidth mt="md" onClick={handleValidateReport}>
              Validar Reporte
            </Button>
          </Container>
        </SimpleGrid>
      )}
    </Drawer>
  );
}
