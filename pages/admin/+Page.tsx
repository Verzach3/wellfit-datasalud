import { useEffect, useState } from "react";
import {
  ActionIcon,
  Card,
  Center,
  Container,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { getFiles } from "../../functions/getFiles.telefunc.js";
import UserFiles from "@/components/admin/UserFiles.jsx";
import classes from "./Page.module.css";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { ReportCreator } from "@/components/admin/ReportCreator.jsx";

function AdminPage() {
  const [files, setFiles] = useState<Awaited<ReturnType<typeof getFiles>>>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const fetchedFiles = await getFiles();
      console.log(fetchedFiles);
      setFiles(fetchedFiles);
      setLoading(false);
    };
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <Container className={classes.loaderContainer}>
        <Loader size="xl" color="blue" />
      </Container>
    );
  }

  if (("error" in files && files.error) || !Array.isArray(files)) {
    return (
      <Container className={classes.errorContainer}>
        <Text c="red" size="lg">
          {files.error}
        </Text>
      </Container>
    );
  }

  return (
    <Container size="xl" className={classes.pageContainer}>
      <Card className={classes.headerCard}>
        <Title className={classes.mainTitle}>
          Lista de archivos de pacientes para{" "}
          <span className={classes.highlight}>Data-Salud</span>
        </Title>
      </Card>
      <Center>
        <Group justify="space-between" w={"96%"} mb={"md"}>
          <Group grow>
            <TextInput
              placeholder="Buscar..."
              radius={0}
              w={"60dvw"}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              leftSection={
                <ThemeIcon size={"lg"} radius={0} color="gray">
                  <IconSearch />
                </ThemeIcon>
              }
            />
          </Group>
          <Group>
            <ActionIcon radius={0} size={"lg"} color="gray">
              <IconFilter />
            </ActionIcon>
          </Group>
        </Group>
      </Center>
      <ScrollArea className={classes.scrollArea} offsetScrollbars>
        <Stack gap="lg">
          {files.map((file) => (
            <UserFiles
              key={file.name}
              birth_date={file.userProfile?.birth_date ?? ""}
              cedula={file.userProfile?.cedula ?? ""}
              lastname={file.userProfile?.first_lastname ?? ""}
              name={file.userProfile?.first_name ?? ""}
              folder_name={file.name}
              user_id={file.userProfile?.user_id}
              file_status={file.status ?? "Recibido"}
              //@ts-ignore
              organization={file.userProfile?.organization.name ?? ""}
            />
          ))}
        </Stack>
      </ScrollArea>
    </Container>
  );
}

export default AdminPage;
