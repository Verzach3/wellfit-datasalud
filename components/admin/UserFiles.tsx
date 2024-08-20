import { getFolderFiles } from "@/functions/getFolderFiles.telefunc";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconChevronDown,
  IconDownload,
  IconFilePlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { FileObject } from "@supabase/storage-js";
import { generateDownload } from "@/functions/generateDownload.telefunc";
import { addReport } from "@/functions/addReport.telefunc";

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
  const [modal, setModal] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [report, setReport] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  useEffect(() => {
    (async () => {
      const filesRes = await getFolderFiles(folder_name);
      if (filesRes.error) {
        console.log(filesRes.error);
        return;
      }
      setFiles(filesRes.data.filter((file) => file.name.endsWith(".pdf")));
    })();
  });

  return (
    <>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
        <Textarea
          label="Reporte"
          mb={"xl"}
          onChange={(e) => setReport(e.target.value)}
          value={report}
          minRows={10}
          maxRows={20}
          placeholder="Escribe aquí el reporte"
          required
        />
        <Button
          disabled={disabledButton}
          onClick={async () => {
            setDisabledButton(true);
            await addReport(report, folder_name);
            setModalOpened(false);
            setDisabledButton(false);
          }}
        >
          Agregar
        </Button>
      </Modal>
      <Box>
        <Card withBorder radius={0}>
          <Group justify="space-between">
            <Group>
              <Title>{`${name} ${lastname}`}</Title>
            </Group>
            <Group>
              <ActionIcon
                size={"lg"}
                radius={0}
                onClick={() => setModalOpened(true)}
                color="gray"
              >
                <IconFilePlus />
              </ActionIcon>
              <ActionIcon
                size={"lg"}
                radius={0}
                onClick={() => setCollapsed(!collapsed)}
                color="gray"
              >
                <IconChevronDown />
              </ActionIcon>
            </Group>
          </Group>
          <Text>{birth_date}</Text>
          <Text>{cedula}</Text>
        </Card>
        <Collapse in={collapsed}>
          <Stack w={"100%"} gap={0}>
            {files.map((file) => (
              <Center key={file.name}>
                <Card
                  key={file.name}
                  withBorder
                  w={"96%"}
                  radius={0}
                  style={{
                    borderTop: "none",
                  }}
                >
                  <Group justify="space-between">
                    <Group>
                      <Text fw={600}>{file.name}</Text>
                    </Group>
                    <Button
                      color="gray"
                      rightSection={<IconDownload />}
                      onClick={async () => {
                        const link = await generateDownload(
                          `${folder_name}/${file.name}`
                        );
                        // open link in new tab
                        if ("error" in link) {
                          console.log(link.error);
                          return;
                        }
                        window.open(link.signedUrl, "_blank");
                      }}
                    >
                      Descargar
                    </Button>
                  </Group>
                </Card>
              </Center>
            ))}
          </Stack>
        </Collapse>
      </Box>
    </>
  );
}

export default UserFiles;
