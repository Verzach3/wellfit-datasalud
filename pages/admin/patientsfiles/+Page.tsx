import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Title,
  Table,
  Text,
  Button,
  Modal,
  Group,
  Badge,
  TextInput,
  Stack,
  LoadingOverlay,
  Pagination,
  Card,
  Transition,
  Notification,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconUpload, IconTrash, IconEye, IconX } from '@tabler/icons-react';
import { SupabaseClient } from '@supabase/supabase-js';
import classes from './Page.module.css';

interface Patient {
  id: number;
  created_at: string;
  first_name: string;
  second_name: string | null;
  first_lastname: string;
  second_lastname: string | null;
  user_id: string;
  birth_date: string;
  gender: string;
  phone: string | null;
  cedula: string | null;
  has_files: boolean;
  organization?: {
    name: string;
  };
}

function PatientFilesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Consulta mejorada que incluye la información de la organización
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(name)
        `)
        .order('first_name', { ascending: true });

      if (error) throw error;

      if (profiles && profiles.length > 0) {
        const patientsData = await Promise.all(
          profiles.map(async (profile) => {
            let has_files = false;
            try {
              const { data: files } = await supabase.storage
                .from('patient-documents')
                .list(profile.id.toString());
              
              has_files = !!files && files.length > 0;
            } catch (filesError) {
              console.error('Error checking files for patient:', profile.id, filesError);
            }

            return {
              ...profile,
              has_files,
            } as Patient;
          })
        );
        setPatients(patientsData);
      } else {
        setError('No se encontraron pacientes en la base de datos.');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Hubo un error al cargar los pacientes. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.second_name || ''} ${patient.first_lastname} ${patient.second_lastname || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.cedula?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  const handleUpload = async (file: File) => {
    if (!selectedPatient) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.storage
        .from('patient-documents')
        .upload(`${selectedPatient.id}/${file.name}`, file);

      if (error) throw error;
      
      await fetchPatients();
      close();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Hubo un error al subir el archivo. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFiles = async (patientId: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('patient-documents')
        .list(patientId.toString());

      if (listError) throw listError;

      if (files && files.length > 0) {
        const deletePromises = files.map((file) =>
          supabase.storage
            .from('patient-documents')
            .remove([`${patientId}/${file.name}`])
        );

        const deleteResults = await Promise.all(deletePromises);
        const deleteErrors = deleteResults.filter(result => result.error);

        if (deleteErrors.length > 0) {
          console.error('Errors deleting some files:', deleteErrors);
          setError('Hubo errores al eliminar algunos archivos.');
        }

        await fetchPatients();
      }
    } catch (error) {
      console.error('Error deleting files:', error);
      setError('Hubo un error al eliminar los archivos. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl" className={classes.container}>
      <LoadingOverlay visible={loading} />
      <Title order={1} className={classes.title}>Gestión de Archivos de Pacientes</Title>
      {error && (
        <Notification icon={<IconX size="1.1rem" />} color="red" onClose={() => setError(null)}>
          {error}
        </Notification>
      )}
      <Card className={classes.searchCard} shadow="sm">
        <TextInput
          leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
          placeholder="Buscar por nombre, cédula u organización..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.search}
        />
      </Card>
      <Card className={classes.tableCard} shadow="sm">
        <Table className={classes.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre Completo</Table.Th>
              <Table.Th>Cédula</Table.Th>
              <Table.Th>Fecha de Nacimiento</Table.Th>
              <Table.Th>Género</Table.Th>
              <Table.Th>Teléfono</Table.Th>
              <Table.Th>Organización</Table.Th>
              <Table.Th>Estado de Archivos</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedPatients.map((patient) => (
              <Transition key={patient.id} transition="fade" duration={500} timingFunction="ease" mounted={true}>
                {(styles) => (
                  <Table.Tr style={styles}>
                    <Table.Td>{`${patient.first_name} ${patient.second_name || ''} ${patient.first_lastname} ${patient.second_lastname || ''}`.trim()}</Table.Td>
                    <Table.Td>{patient.cedula || 'N/A'}</Table.Td>
                    <Table.Td>{new Date(patient.birth_date).toLocaleDateString()}</Table.Td>
                    <Table.Td>{patient.gender}</Table.Td>
                    <Table.Td>{patient.phone || 'N/A'}</Table.Td>
                    <Table.Td>{patient.organization?.name || 'N/A'}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={patient.has_files ? 'green' : 'red'}
                        variant="light"
                      >
                        {patient.has_files ? 'Archivos Cargados' : 'Sin Archivos'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <Button
                          leftSection={<IconUpload size="1rem" />}
                          onClick={() => {
                            setSelectedPatient(patient);
                            open();
                          }}
                          size="xs"
                          variant="outline"
                        >
                          Subir
                        </Button>
                        {patient.has_files && (
                          <>
                            <Button
                              leftSection={<IconEye size="1rem" />}
                              onClick={() => {/* Implementar vista de archivos */}}
                              size="xs"
                              variant="outline"
                            >
                              Ver
                            </Button>
                            <Button
                              leftSection={<IconTrash size="1rem" />}
                              color="red"
                              onClick={() => handleDeleteFiles(patient.id)}
                              size="xs"
                              variant="outline"
                            >
                              Eliminar
                            </Button>
                          </>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Transition>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
      <Pagination
        total={Math.ceil(filteredPatients.length / patientsPerPage)}
        value={currentPage}
        onChange={setCurrentPage}
        className={classes.pagination}
      />
      <Modal opened={opened} onClose={close} title="Subir Archivo" centered>
        <Stack>
          <Text>Subir archivo para {selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.first_lastname}` : ''}</Text>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </Stack>
      </Modal>
    </Container>
  );
}

export default PatientFilesPage;