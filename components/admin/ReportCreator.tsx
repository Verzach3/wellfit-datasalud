import { getFilesText } from "@/functions/getFilesText.telefunc";
import {
  Text,
  Affix,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Drawer,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  ThemeIcon,
  Title,
  Stack,
} from "@mantine/core";
import type { FileObject } from "@supabase/storage-js";
import { IconFile } from "@tabler/icons-react";
import { useRef, useState } from "react";
import MdRenderer from "../chat/MdRenderer";
import { useClipboard } from "@mantine/hooks";
import { useCompletion } from "ai/react";
import { useReactToPrint } from "react-to-print";
import styles from './RepotCreator.module.css';

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
  const [openReport, setOpenReport] = useState(false);
  const [loadingFilesText, setLoadingFilesText] = useState(false);
  const { complete, completion, setCompletion, isLoading } = useCompletion();
  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef });
  return (
    <Drawer
      position="bottom"
      title={<div className={styles.drawerTitle}>Reporte de datos</div>}
      opened={open}
      onClose={onClose}
      size="xl"
      padding="md"
      className={styles.drawer}
    >
      <Modal
        opened={openReport}
        onClose={() => {
          setFilesText("");
          setCompletion("");
          setOpenReport(false);
        }}
        fullScreen
        className={styles.modal}
      >
        {loadingFilesText && (
          <Center>
            <Stack>
              <Center>
                <Loader size="xl" style={{ zIndex: 1000 }} color="blue" />
              </Center>
              <Text>Analizando Archivos</Text>
            </Stack>
          </Center>
        )}
        {!loadingFilesText && (
          <>
            <Center>
              <Loader type="dots" />
            </Center>
            <Container>
              <Container ref={contentRef} mx={"lg"}>
                <MdRenderer content={completion} />
              </Container>
            </Container>
          </>
        )}
      </Modal>
      <SimpleGrid cols={4} spacing="md" className={styles.fileGrid}>
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
        <Affix position={{ bottom: 20, right: 20 }}>
          {(filesText === "" || loadingFilesText) && (
            <Button
              onClick={async () => {
                setOpenReport(true);
                setLoadingFilesText(true);
                getFilesText(folderName, selectedFiles).then((report) => {
                  setFilesText(report);
                  setLoadingFilesText(false);
                  complete(report);
                });
              }}
            >
              Siguiente
            </Button>
          )}
          {/* {filesText !== "" && (
            <Button onClick={() => complete(filesText)} disabled={isLoading}>
              Crear Reporte
            </Button>
          )} */}
          {(!isLoading && completion !== "" ) && (
            <Button onClick={() => reactToPrint()}>Imprimir</Button>
          )}
        </Affix>
      </SimpleGrid>
    </Drawer>
  );
}