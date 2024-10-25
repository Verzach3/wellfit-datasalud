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
import { getFiles } from "../../../functions/getFiles.telefunc";
import { getAllProfiles } from "../../../functions/getAllProfiles.telefunc";
import classes from "./page.module.css";
import { IconChevronDown, IconChevronRight, IconFilter, IconSearch } from "@tabler/icons-react";

// Interfaces actualizadas
interface Organization {
  id: number;
  name: string;
  created_at: string;
}

interface Profile {
  birth_date: string;
  cedula: string | null;
  created_at: string;
  first_lastname: string;
  first_name: string;
  gender: string;
  id: number;
  organization: Organization | number;
  phone: string | null;
  second_lastname: string | null;
  second_name: string | null;
  user_id: string;
}

interface FileData {
  name: string;
  id?: string;
  created_at: string;
  updated_at?: string;
  last_accessed_at?: string;
  metadata?: any;
  bucket?: string;
  owner?: string;
  size?: number;
  userProfile?: Profile;
  status?: string | null;
}

function PatientFilesView() {
  const [patients, setPatients] = useState<Profile[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await getAllProfiles();
        if (Array.isArray(data)) {
          setPatients(data as Profile[]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = async (patientId: string) => {
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
      setFiles([]);
      return;
    }

    setSelectedPatientId(patientId);
    setLoadingFiles(true);
    try {
      const response = await getFiles();
      if ('error' in response) {
        console.error('Error:', response.error);
        setFiles([]);
        return;
      }

      const patientFiles = response.filter(
        (file) => file.userProfile?.user_id === patientId
      );
      setFiles(patientFiles as FileData[]);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    [
      patient.first_name,
      patient.first_lastname,
      patient.cedula,
      patient.phone,
    ]
      .filter(Boolean)
      .some((field) =>
        field?.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const getStatusClass = (status: string | null | undefined) => {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'recibido':
        return classes.statusRecibido;
      case 'pendiente':
        return classes.statusPendiente;
      case 'procesando':
        return classes.statusProcesando;
      default:
        return '';
    }
  };

  const formatFileDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función auxiliar para obtener el nombre de la organización
  const getOrganizationName = (organization: Organization | number | undefined) => {
    if (!organization) return '-';
    if (typeof organization === 'number') return organization.toString();
    return organization.name || '-';
  };

  if (loading) {
    return (
      <Container className={classes.loaderContainer}>
        <Loader size="xl" color="blue" />
      </Container>
    );
  }

  return (
    <Container size="xl" className={classes.pageContainer}>
      <Card className={classes.headerCard}>
        <Title className={classes.mainTitle}>
          Historias Clínicas{" "}
          <span className={classes.highlight}>Data-Salud</span>
        </Title>
      </Card>

      <Center>
        <Group justify="space-between" w="96%" mb="md">
          <Group grow>
            <TextInput
              placeholder="Buscar paciente..."
              radius={0}
              size="md"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              leftSection={
                <ThemeIcon size="lg" radius={0} color="gray">
                  <IconSearch size={20} />
                </ThemeIcon>
              }
            />
          </Group>
          <ActionIcon radius={0} size="lg" color="gray">
            <IconFilter size={20} />
          </ActionIcon>
        </Group>
      </Center>

      <div className={classes.tableContainer}>
        <ScrollArea className={classes.scrollArea} offsetScrollbars>
          <table className={classes.table}>
            <thead className={classes.tableHeader}>
              <tr>
                <th className={classes.tableHeaderCell}></th>
                <th className={classes.tableHeaderCell}>Cédula</th>
                <th className={classes.tableHeaderCell}>Nombre Completo</th>
                <th className={classes.tableHeaderCell}>Fecha Nacimiento</th>
                <th className={classes.tableHeaderCell}>Teléfono</th>
                <th className={classes.tableHeaderCell}>Organización</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <>
                  <tr
                    key={patient.id}
                    className={`${classes.tableRow} ${
                      selectedPatientId === patient.user_id ? classes.tableRowActive : ''
                    }`}
                    onClick={() => handlePatientClick(patient.user_id)}
                  >
                    <td className={classes.tableCell}>
                      {selectedPatientId === patient.user_id ? (
                        <IconChevronDown size={20} />
                      ) : (
                        <IconChevronRight size={20} />
                      )}
                    </td>
                    <td className={classes.tableCell}>{patient.cedula || '-'}</td>
                    <td className={classes.tableCell}>
                      {[
                        patient.first_name,
                        patient.second_name,
                        patient.first_lastname,
                        patient.second_lastname,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    </td>
                    <td className={classes.tableCell}>
                      {new Date(patient.birth_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className={classes.tableCell}>{patient.phone || '-'}</td>
                    <td className={classes.tableCell}>
                      {getOrganizationName(patient.organization)}
                    </td>
                  </tr>
                  {selectedPatientId === patient.user_id && (
                    <tr>
                      <td colSpan={6} className={classes.filesList}>
                        {loadingFiles ? (
                          <Center p="xl">
                            <Loader size="md" />
                          </Center>
                        ) : files.length > 0 ? (
                          <Stack>
                            {files.map((file) => (
                              <Card key={file.name} className={classes.fileCard}>
                                <div className={classes.fileHeader}>
                                  <div>
                                    <Text className={classes.fileName}>
                                      {file.name}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                      Subido el: {formatFileDate(file.created_at)}
                                    </Text>
                                  </div>
                                  <span
                                    className={`${classes.fileStatus} ${getStatusClass(file.status)}`}
                                  >
                                    {file.status || 'Pendiente'}
                                  </span>
                                </div>
                                <Text size="sm" c="dimmed">
                                  Organización: {getOrganizationName(file.userProfile?.organization)}
                                </Text>
                              </Card>
                            ))}
                          </Stack>
                        ) : (
                          <Text className={classes.noFiles}>
                            No se encontraron archivos para este paciente
                          </Text>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </Container>
  );
}

export default PatientFilesView;