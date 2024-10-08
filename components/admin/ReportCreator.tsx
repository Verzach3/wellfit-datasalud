import { generateReport } from "@/functions/generateReport.telefunc";
import {
  Affix,
  Button,
  Card,
  Center,
  Checkbox,
  Drawer,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import type { FileObject } from "@supabase/storage-js";
import { IconFile } from "@tabler/icons-react";
import { useState } from "react";
import Markdown from "react-markdown";
import MdRenderer from "../chat/MdRenderer";
import { useClipboard } from "@mantine/hooks";

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
  const [report, setReport] = useState("");
  const [openReport, setOpenReport] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const clipboard = useClipboard({ timeout: 500 })
  return (
    <Drawer
      position="bottom"
      title="Reporte de datos"
      opened={open}
      onClose={onClose}
      size={"xl"}
      padding={"md"}
    >
      <Modal
        opened={openReport}
        onClose={() => setOpenReport(false)}
        fullScreen
      >
        {loadingReport && (
          <Stack justify="center">
            <Text ta={"center"}>Estamos Cargando el reporte</Text>
            <Center>
              <Loader />
            </Center>
          </Stack>
        )}

        {!loadingReport && <>
          <MdRenderer content={report} />
          <Affix position={{ left: 10, bottom: 20}}>
            <Button onClick={() => clipboard.copy(report)}>
              Copy
            </Button>
          </Affix>
        </>
        }
      </Modal>
      <SimpleGrid cols={4} spacing="md">
        {files.map((file) => (
          <Card key={file.name} withBorder>
            <Group justify="space-between">
              <Checkbox
                onClick={() => {
                  if (selectedFiles.includes(file)) {
                    setSelectedFiles(selectedFiles.filter((f) => f !== file));
                  } else {
                    setSelectedFiles([...selectedFiles, file]);
                  }
                }}
              />
              {file.name}
              <ThemeIcon variant="white">
                <IconFile />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
        <Affix position={{ bottom: 20, right: 20 }}>
          <Button
            onClick={async () => {
              setLoadingReport(true);
              setOpenReport(true);
              generateReport(folderName, selectedFiles).then((report) => {
                setLoadingReport(false);
                setReport(report);
              });
            }}
          >
            Crear Reporte
          </Button>
        </Affix>
      </SimpleGrid>
    </Drawer>
  );
}
