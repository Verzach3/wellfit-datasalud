import { useEffect, useState } from "react";
import {
  ActionIcon,
  Card,
  Center,
  Container,
  Group,
  Loader,
  ScrollArea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {  getAllProfiles} from "../../../functions/getAllProfiles.telefunc";
import classes from "./page.module.css";
import { IconFilter, IconSearch } from "@tabler/icons-react";

interface Patient {
  birth_date: string;
  cedula: string | null;
  created_at: string;
  first_lastname: string;
  first_name: string;
  gender: string;
  id: number;
  organization: number;
  phone: string | null;
  second_lastname: string | null;
  second_name: string | null;
  user_id: string;
}

function PatientListView() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await getAllProfiles();
        if (Array.isArray(data)) {
          setPatients(data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderBadgeClass = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return classes.badgeMale;
      case 'female':
        return classes.badgeFemale;
      default:
        return classes.badgeOther;
    }
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
          Directorio de Pacientes{" "}
          <span className={classes.highlight}>Data-Salud</span>
        </Title>
      </Card>

      <Center>
        <Group justify="space-between" w="96%" mb="md">
          <Group grow>
            <div className={classes.searchInputWrapper}>
              <TextInput
                placeholder="Buscar por nombre, cédula o teléfono..."
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
            </div>
          </Group>
          <ActionIcon
            className={classes.filterButton}
            radius={0}
            size="lg"
            color="gray"
          >
            <IconFilter size={20} />
          </ActionIcon>
        </Group>
      </Center>

      <div className={classes.tableContainer}>
        <ScrollArea className={classes.scrollArea} offsetScrollbars>
          <table className={classes.table}>
            <thead className={classes.tableHeader}>
              <tr>
                <th className={classes.tableHeaderCell}>Cédula</th>
                <th className={classes.tableHeaderCell}>Nombre Completo</th>
                <th className={classes.tableHeaderCell}>Género</th>
                <th className={classes.tableHeaderCell}>Fecha Nacimiento</th>
                <th className={classes.tableHeaderCell}>Teléfono</th>
                <th className={classes.tableHeaderCell}>Fecha Registro</th>
                <th className={classes.tableHeaderCell}>ID Usuario</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className={classes.tableRow}>
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
                    <span className={`${classes.badge} ${getGenderBadgeClass(patient.gender)}`}>
                      {patient.gender}
                    </span>
                  </td>
                  <td className={classes.tableCell}>
                    {formatDate(patient.birth_date)}
                  </td>
                  <td className={classes.tableCell}>{patient.phone || '-'}</td>
                  <td className={classes.tableCell}>
                    {formatDate(patient.created_at)}
                  </td>
                  <td className={classes.tableCell}>{patient.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className={classes.noResults}>
              No se encontraron pacientes con los criterios de búsqueda
            </div>
          )}
        </ScrollArea>
      </div>
    </Container>
  );
}

export default PatientListView;