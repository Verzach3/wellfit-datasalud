import { useEffect, useState } from "react";
import {
  ActionIcon,
  Card,
  Center,
  Container,
  Group,
  Text,
  Loader,
  ScrollArea,
  TextInput,
  ThemeIcon,
  Title,
  Button,
  Drawer,
  Stack,
  Box,
  MultiSelect,
} from "@mantine/core";
import { IconFilter, IconSearch, IconX } from "@tabler/icons-react";
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { getAllProfiles } from "../../../functions/getAllProfiles.telefunc";
import { PatientActionMenu } from "../../../components/admin/Menu";
import classes from "./page.module.css";

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
  age?: number;
}

interface Filters {
  search: string;
  genders: string[];
  dateRange: [Date | null, Date | null];
  organizations: number[];
  ageRange: [number | null, number | null];
}

function PatientListView() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    genders: [],
    dateRange: [null, null],
    organizations: [],
    ageRange: [null, null],
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })} ${date.toLocaleTimeString('es-ES')}`;
  };

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await getAllProfiles();
        if (Array.isArray(data)) {
          const patientsWithAge = data.map(patient => ({
            ...patient,
            age: calculateAge(patient.birth_date)
          }));
          setPatients(patientsWithAge);
        } else if ('error' in data) {
          notifications.show({
            title: 'Error',
            message: 'Error al cargar los pacientes',
            color: 'red',
          });
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        notifications.show({
          title: 'Error',
          message: 'Error al cargar los pacientes',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleUpdatePatient = async (patientId: number) => {
    console.log("Actualizar paciente:", patientId);
  };

  const handleDeletePatient = async (patientId: number) => {
    console.log("Eliminar paciente:", patientId);
  };

  const handleSuspendPatient = async (patientId: number) => {
    console.log("Suspender paciente:", patientId);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      genders: [],
      dateRange: [null, null],
      organizations: [],
      ageRange: [null, null],
    });
    notifications.show({
      title: 'Filtros limpiados',
      message: 'Se han reiniciado todos los filtros',
      color: 'blue',
    });
  };

  const filteredPatients = patients.filter((patient) => {
    const searchMatch = 
      !filters.search ||
      [
        patient.first_name,
        patient.first_lastname,
        patient.cedula,
        patient.phone,
        patient.age?.toString(),
      ]
        .filter(Boolean)
        .some((field) =>
          field?.toLowerCase().includes(filters.search.toLowerCase())
        );

    const genderMatch = 
      filters.genders.length === 0 || 
      filters.genders.includes(patient.gender);

    const [startDate, endDate] = filters.dateRange;
    const birthDate = new Date(patient.birth_date);
    const dateMatch = 
      (!startDate || birthDate >= startDate) &&
      (!endDate || birthDate <= endDate);

    const [minAge, maxAge] = filters.ageRange;
    const ageMatch = 
      (!minAge || (patient.age && patient.age >= minAge)) &&
      (!maxAge || (patient.age && patient.age <= maxAge));

    const organizationMatch = 
      filters.organizations.length === 0 || 
      filters.organizations.includes(patient.organization);

    return searchMatch && genderMatch && dateMatch && organizationMatch && ageMatch;
  });

  const getGenderLabel = (gender: string) => {
    return gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : gender;
  };

  const getGenderBadgeClass = (gender: string) => {
    switch (gender) {
      case 'M':
        return classes.badgeMale;
      case 'F':
        return classes.badgeFemale;
      default:
        return classes.badgeOther;
    }
  };

  const validateAgeRange = (min: number | null, max: number | null): boolean => {
    if (min === null || max === null) return true;
    return min <= max;
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
        <Group justify="space-between" w="96%" mb="md" className={classes.controlsGroup}>
          <Group grow className={classes.searchGroup}>
            <div className={classes.searchInputWrapper}>
              <TextInput
                placeholder="Buscar por nombre, cédula, teléfono o edad..."
                radius={0}
                size="md"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                leftSection={
                  <ThemeIcon size="lg" radius={0} color="gray">
                    <IconSearch size={20} />
                  </ThemeIcon>
                }
                rightSection={
                  filters.search && (
                    <ActionIcon onClick={() => setFilters({...filters, search: ""})}>
                      <IconX size={16} />
                    </ActionIcon>
                  )
                }
              />
            </div>
          </Group>
          <Group>
            <Button 
              variant="light" 
              leftSection={<IconFilter size={20} />}
              onClick={() => setDrawerOpened(true)}
              className={classes.filterButton}
            >
              Filtros
              {Object.values(filters).some(value => 
                Array.isArray(value) ? value.length > 0 : value
              ) && (
                <Box className={classes.filterBadge} />
              )}
            </Button>
          </Group>
        </Group>
      </Center>

      <Box className={classes.tableWrapper}>
        <ScrollArea h="calc(100vh - 250px)" offsetScrollbars type="always">
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <thead className={classes.tableHeader}>
                <tr>
                  <th className={classes.tableHeaderCell}>Cédula</th>
                  <th className={classes.tableHeaderCell}>Nombre Completo</th>
                  <th className={classes.tableHeaderCell}>Género</th>
                  <th className={classes.tableHeaderCell}>Edad</th>
                  <th className={classes.tableHeaderCell}>Fecha Nacimiento</th>
                  <th className={classes.tableHeaderCell}>Teléfono</th>
                  <th className={classes.tableHeaderCell}>Fecha y Hora Registro</th>
                  <th className={classes.tableHeaderCell}>ID Usuario</th>
                  <th className={classes.tableHeaderCell}></th>
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
                        {getGenderLabel(patient.gender)}
                      </span>
                    </td>
                    <td className={classes.tableCell}>
                      <span className={classes.ageBadge}>
                        {patient.age} años
                      </span>
                    </td>
                    <td className={classes.tableCell}>
                      {formatDate(patient.birth_date)}
                    </td>
                    <td className={classes.tableCell}>{patient.phone || '-'}</td>
                    <td className={classes.tableCell}>
                      {formatDateTime(patient.created_at)}
                    </td>
                    <td className={classes.tableCell}>{patient.user_id}</td>
                    <td className={classes.actionCell}>
                      <PatientActionMenu
                        patient={patient}
                        onUpdatePatient={handleUpdatePatient}
                        onDeletePatient={handleDeletePatient}
                        onSuspendPatient={handleSuspendPatient}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
              <div className={classes.noResults}>
                No se encontraron pacientes con los criterios de búsqueda
              </div>
            )}
            {filteredPatients.length > 0 && filters.search && (
              <div className={classes.searchResults}>
                Se encontraron {filteredPatients.length} resultados
              </div>
            )}
          </div>
        </ScrollArea>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Filtros"
        position="right"
        size="md"
        className={classes.filtersDrawer}
      >
        <Stack gap="md" p="md">
          <MultiSelect
            label="Género"
            placeholder="Seleccionar géneros"
            data={[
              { value: 'M', label: 'Masculino' },
              { value: 'F', label: 'Femenino' }
            ]}
            value={filters.genders}
            onChange={(value) => setFilters({...filters, genders: value})}
            clearable
          />

          <Group grow className={classes.ageFilterGroup}>
            <TextInput
              label="Edad mínima"
              type="number"
              placeholder="Desde"
              className={classes.ageInput}
              value={filters.ageRange[0]?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setFilters({
                  ...filters,
                  ageRange: [value, filters.ageRange[1]]
                });
              }}
              error={!validateAgeRange(filters.ageRange[0], filters.ageRange[1])}
            />
            <TextInput
              label="Edad máxima"
              type="number"
              placeholder="Hasta"
              className={classes.ageInput}
              value={filters.ageRange[1]?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setFilters({
                  ...filters,
                  ageRange: [filters.ageRange[0], value]
                });
              }}
              error={!validateAgeRange(filters.ageRange[0], filters.ageRange[1])}
            />
          </Group>
          {!validateAgeRange(filters.ageRange[0], filters.ageRange[1]) && (
            <div className={classes.ageRangeError}>
              <Text>
                La edad mínima debe ser menor o igual a la edad máxima
              </Text>
            </div>
          )}

          <DatePickerInput
            type="range"
            label="Rango de fecha de nacimiento"
            placeholder="Seleccionar rango de fechas"
            value={filters.dateRange}
            onChange={(value) => setFilters({...filters, dateRange: value as [Date | null, Date | null]})}
            clearable
            valueFormat="DD/MM/YYYY"
          />

          <MultiSelect
            label="Organización"
            placeholder="Seleccionar organizaciones"
            data={Array.from(new Set(patients.map(p => p.organization))).map(org => ({
              value: org.toString(),
              label: `Organización ${org}`
            }))}
            value={filters.organizations.map(String)}
            onChange={(value) => setFilters({...filters, organizations: value.map(Number)})}
            clearable
          />

          <Group mt="xl" justify="flex-end">
            <Button variant="light" onClick={clearFilters}>
              Limpiar filtros
            </Button>
            <Button 
              onClick={() => setDrawerOpened(false)}
              disabled={!validateAgeRange(filters.ageRange[0], filters.ageRange[1])}
            >
              Aplicar filtros
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
}

export default PatientListView;
