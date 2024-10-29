import { useEffect, useState } from "react";
import {
  ActionIcon,
  Card,
  Container,
  Group,
  Loader,
  ScrollArea,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Table,
  Menu,
} from "@mantine/core";
import { getFiles } from "../../../functions/getFiles.telefunc.js";
import UserFiles from "@/components/admin/UserFiles.jsx";
import { IconDots, IconFilter, IconSearch, IconInfoCircle, IconHistory } from "@tabler/icons-react";
import classes from "./page.module.css";

// Definimos las interfaces
interface UserProfile {
  birth_date: string;
  cedula: string | null;
  first_lastname: string;
  first_name: string;
  organization: { name: string } | null;
  user_id: string;
}

interface FileData {
  userProfile?: UserProfile;
  name: string;
  status: string;
}

function AdminPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<FileData | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const fetchedFiles = await getFiles();

      if ("error" in fetchedFiles) {
        console.error("Error fetching files:", fetchedFiles.error);
        setFiles([]);
      } else {
        setFiles(fetchedFiles as FileData[]);
      }

      setLoading(false);
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.userProfile?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
    file.userProfile?.cedula?.includes(searchText)
  );

  if (loading) {
    return (
      <Container className={classes.loaderContainer}>
        <Loader size="xl" color="blue" />
      </Container>
    );
  }

  if (!files.length) {
    return (
      <Container className={classes.errorContainer}>
        <Text color="red" size="lg">
          No se encontraron archivos o ocurrió un error.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="xl" className={classes.pageContainer}>
      <Card className={classes.headerCard}>
        <Title className={classes.mainTitle}>
          Lista de archivos de pacientes para <span className={classes.highlight}>Data-Salud</span>
        </Title>
      </Card>

      <Group justify="space-between" w={"96%"} mb={"md"} mt="md">
        <TextInput
          placeholder="Buscar por nombre o cédula..."
          radius="xl"
          w={"60dvw"}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          leftSection={
            <ThemeIcon size={"lg"} radius="xl" color="gray">
              <IconSearch />
            </ThemeIcon>
          }
          className={classes.searchInput}
        />
        <ActionIcon radius="xl" size={"lg"} color="gray" className={classes.filterIcon}>
          <IconFilter />
        </ActionIcon>
      </Group>

      <ScrollArea className={classes.scrollArea} offsetScrollbars>
        <Table className={classes.styledTable} striped highlightOnHover>
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre Completo</th>
              <th>Fecha de Nacimiento</th>
              <th>Organización</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file.name}>
                <td>{file.userProfile?.cedula || "N/A"}</td>
                <td>
                  {file.userProfile
                    ? `${file.userProfile.first_name} ${file.userProfile.first_lastname}`
                    : "N/A"}
                </td>
                <td>{file.userProfile?.birth_date || "N/A"}</td>
                <td>{file.userProfile?.organization?.name || "Desconocido"}</td>
                <td>{file.status || "Recibido"}</td>
                <td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDots style={{ width: 16, height: 16 }} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Acciones</Menu.Label>
                      <Menu.Item
                        leftSection={<IconInfoCircle size={16} />}
                        onClick={() => setSelectedUser(file)}
                      >
                        Ver Detalles
                      </Menu.Item>
                     
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      {selectedUser && (
        <UserFiles
          birth_date={selectedUser.userProfile?.birth_date ?? ""}
          cedula={selectedUser.userProfile?.cedula ?? ""}
          lastname={selectedUser.userProfile?.first_lastname ?? ""}
          name={selectedUser.userProfile?.first_name ?? ""}
          folder_name={selectedUser.name}
          user_id={selectedUser.userProfile?.user_id}
          file_status={selectedUser.status ?? "Recibido"}
          organization={selectedUser.userProfile?.organization?.name ?? "Desconocido"}
          files={[]}
        />
      )}
    </Container>
  );
}

export default AdminPage;
