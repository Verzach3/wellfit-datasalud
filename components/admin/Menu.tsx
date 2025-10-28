import { useState } from 'react';
import { Menu, ActionIcon, Modal, TextInput, Button, Stack, Textarea, Select } from '@mantine/core';
import { 
  IconDots, 
  IconEdit, 
  IconTrash, 
  IconFileDescription,
  IconUserOff
} from '@tabler/icons-react';
import classes from './Menu.module.css';

interface Patient {
  id: number;
  birth_date: string;
  cedula: string | null;
  first_lastname: string;
  first_name: string;
  second_lastname: string | null;
  second_name: string | null;
  gender: string;
  phone: string | null;
  user_id: string;
  organization: number;
}

interface PatientActionMenuProps {
  patient: Patient;
  onUpdatePatient: (id: number, data: Partial<Patient>) => Promise<void>;
  onDeletePatient: (id: number, reason: string) => Promise<void>;
  onSuspendPatient: (id: number, reason: string) => Promise<void>;
}

export function PatientActionMenu({ patient, onUpdatePatient, onDeletePatient, onSuspendPatient }: PatientActionMenuProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({
    first_name: patient.first_name,
    second_name: patient.second_name,
    first_lastname: patient.first_lastname,
    second_lastname: patient.second_lastname,
    phone: patient.phone,
    gender: patient.gender,
  });
  const [deleteReason, setDeleteReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      await onUpdatePatient(patient.id, editForm);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setLoading(true);
    try {
      await onDeletePatient(patient.id, deleteReason);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendSubmit = async () => {
    setLoading(true);
    try {
      await onSuspendPatient(patient.id, suspendReason);
      setSuspendModalOpen(false);
    } catch (error) {
      console.error('Error suspending patient:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Menu shadow="md" position="bottom-end" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" size="sm" className={classes.actionButton}>
            <IconDots style={{ width: 16, height: 16 }} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Acciones del Paciente</Menu.Label>
          <Menu.Item
            leftSection={<IconEdit style={{ width: 14, height: 14 }} />}
            onClick={() => setEditModalOpen(true)}
          >
            Modificar paciente
          </Menu.Item>
        
          <Menu.Item
            leftSection={<IconUserOff style={{ width: 14, height: 14 }} />}
            onClick={() => setSuspendModalOpen(true)}
          >
            Suspender paciente
          </Menu.Item>

          <Menu.Divider />
          
          <Menu.Label>Zona de peligro</Menu.Label>
          <Menu.Item
            color="red"
            leftSection={<IconTrash style={{ width: 14, height: 14 }} />}
            onClick={() => setDeleteModalOpen(true)}
          >
            Eliminar paciente
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Modal de Edición */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modificar Paciente"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Primer Nombre"
            value={editForm.first_name}
            onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
          />
          <TextInput
            label="Segundo Nombre"
            value={editForm.second_name || ''}
            onChange={(e) => setEditForm({...editForm, second_name: e.target.value})}
          />
          <TextInput
            label="Primer Apellido"
            value={editForm.first_lastname}
            onChange={(e) => setEditForm({...editForm, first_lastname: e.target.value})}
          />
          <TextInput
            label="Segundo Apellido"
            value={editForm.second_lastname || ''}
            onChange={(e) => setEditForm({...editForm, second_lastname: e.target.value})}
          />
          <TextInput
            label="Teléfono"
            value={editForm.phone || ''}
            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
          />
          <Select
            label="Género"
            value={editForm.gender}
            onChange={(value) => setEditForm({...editForm, gender: value || ''})}
            data={[
              { value: 'male', label: 'Masculino' },
              { value: 'female', label: 'Femenino' },
              { value: 'other', label: 'Otro' }
            ]}
          />
          <Button onClick={handleEditSubmit} loading={loading}>
            Guardar cambios
          </Button>
        </Stack>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar Paciente"
      >
        <Stack>
          <Textarea
            label="Motivo de eliminación"
            description="Por favor, indique el motivo por el cual se eliminará el paciente"
            required
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            minRows={3}
          />
          <Button color="red" onClick={handleDeleteSubmit} loading={loading}>
            Confirmar eliminación
          </Button>
        </Stack>
      </Modal>

      {/* Modal de Suspensión */}
      <Modal
        opened={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        title="Suspender Paciente"
      >
        <Stack>
          <Textarea
            label="Motivo de suspensión"
            description="Por favor, indique el motivo por el cual se suspenderá el paciente"
            required
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            minRows={3}
          />
          <Button color="yellow" onClick={handleSuspendSubmit} loading={loading}>
            Confirmar suspensión
          </Button>
        </Stack>
      </Modal>
    </>
  );
}