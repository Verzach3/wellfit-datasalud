import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Card,
  Center,
  Container,
  Group,
  Loader,
  ScrollArea,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Table,
  Collapse,
} from "@mantine/core";
import { IconSearch, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import classes from "./page.module.css";
import UserFiles from "../../../components/admin/UserFiles";
import { getAllProfiles } from "../../../functions/getAllProfiles.telefunc";
import { getFilesByUserId } from "../../../functions/getFilesByUserId.telefunc";

// Interfaces
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

function PatientFilesView() {
  const [patients, setPatients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null);
  const [files, setFiles] = useState<{ [key: string]: any[] }>({}); // Store files for each patient by user_id

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

  const fetchPatientFiles = async (userId: string) => {
    if (!files[userId]) { // Only fetch if not already fetched
      try {
        const filesRes = await getFilesByUserId(userId);
        if (!filesRes.error) {
          setFiles((prevFiles) => ({
            ...prevFiles,
            [userId]: filesRes.files ?? [], // Ensure files is always an array
          }));
        } else {
          console.error("Error fetching files:", filesRes.error);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
  };

  const togglePatientExpand = (patient: Profile) => {
    const newExpandedId = expandedPatientId === patient.id ? null : patient.id;
    setExpandedPatientId(newExpandedId);
    if (newExpandedId) {
      fetchPatientFiles(patient.user_id); // Fetch files for this patient when expanding
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
          Historias Clínicas <span className={classes.highlight}>Data-Salud</span>
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
        </Group>
      </Center>

      <ScrollArea className={classes.scrollArea} offsetScrollbars>
        <Table highlightOnHover>
          <thead className={classes.tableHeader}>
            <tr>
              <th className={classes.tableHeaderCell}>Cédula</th>
              <th className={classes.tableHeaderCell}>Nombre Completo</th>
              <th className={classes.tableHeaderCell}>Fecha Nacimiento</th>
              <th className={classes.tableHeaderCell}>Teléfono</th>
              <th className={classes.tableHeaderCell}>Organización</th>
              <th className={classes.tableHeaderCell}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <React.Fragment key={patient.id}>
                <tr className={classes.tableRow}>
                  <td className={classes.tableCell}>{patient.cedula || '-'}</td>
                  <td className={classes.tableCell}>
                    {[patient.first_name, patient.second_name, patient.first_lastname, patient.second_lastname]
                      .filter(Boolean)
                      .join(' ')}
                  </td>
                  <td className={classes.tableCell}>
                    {new Date(patient.birth_date).toLocaleDateString("es-ES")}
                  </td>
                  <td className={classes.tableCell}>{patient.phone || '-'}</td>
                  <td className={classes.tableCell}>
                    {typeof patient.organization === "number"
                      ? patient.organization.toString()
                      : patient.organization?.name || '-'}
                  </td>
                  <td className={classes.tableCell}>
                    <ActionIcon
                      onClick={() => togglePatientExpand(patient)}
                      variant="subtle"
                    >
                      {expandedPatientId === patient.id ? (
                        <IconChevronUp size={20} />
                      ) : (
                        <IconChevronDown size={20} />
                      )}
                    </ActionIcon>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className={classes.expandedRow}>
                    <Collapse in={expandedPatientId === patient.id}>
                      {expandedPatientId === patient.id && (
                        <UserFiles
                          name={patient.first_name}
                          lastname={patient.first_lastname}
                          birth_date={patient.birth_date}
                          cedula={patient.cedula || ""}
                          folder_name={`user_${patient.user_id}`}
                          file_status="Recibido"
                          user_id={patient.user_id}
                          organization={
                            typeof patient.organization === "number"
                              ? undefined
                              : patient.organization?.name
                          }
                          files={files[patient.user_id] || []} 
                        />
                      )}
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}

export default PatientFilesView;
