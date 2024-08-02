import React, { useEffect, useRef, useState } from 'react';
import {
  Center,
  Container,
  Group,
  ThemeIcon,
  Text,
  Stack,
  Title,
  Card,
  Button,
  Grid,
  Modal,
  ScrollArea,
  Checkbox,
} from '@mantine/core';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import {
  IconFileTypePdf,
  IconFolderUp,
  IconUpload,
} from '@tabler/icons-react';
import {  } from '@supabase/supabase-js';  // Asegúrate de tener esta importación correcta
import styles from './Page.module.css';

function FilesPage() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);
  const openRef = useRef<() => void>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .list(`${(await supabase.auth.getSession()).data.session?.user.id}`);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setFiles(data as unknown as File[]);
      }
      setLoading(false);
    })();
  }, []);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setTermsScrolled(true);
      }
    }
  };

  return (
    <Container className={styles.container}>
      <Title order={1} className={styles.mainTitle}>Carga tus Historias Clínicas</Title>
      <Text className={styles.description}>
        Sube tus documentos médicos de forma segura y organizada. Asegúrate de que tus archivos estén en formato PDF antes de cargarlos.
      </Text>

      <Card withBorder className={styles.mainCard}>
        <Card.Section className={styles.cardHeader}>
          <Group justify="space-between">
            <Text className={styles.sectionTitle}>Archivos Subidos Anteriormente</Text>
            <Button
              onClick={() => {
                if (!termsAccepted) {
                  setModalOpened(true);
                } else {
                  openRef.current?.();
                }
              }}
              rightSection={<IconUpload size={"1.2rem"} />}
              className={styles.uploadButton}
            >
              Subir Archivo
            </Button>
          </Group>
        </Card.Section>
        <Dropzone
          openRef={openRef}
          loading={loading}
          className={styles.dropzone}
          style={{
            display: `${files.length > 1 ? "none" : "block"}`,
          }}
          accept={PDF_MIME_TYPE}
          onDrop={async (files) => {
            setLoading(true);
            for (const file of files) {
              try {
                await supabase.storage
                  .from("patient-documents")
                  .upload(
                    `${(await supabase.auth.getSession()).data.session?.user.id}/${file.name}`,
                    file
                  );
              } catch (error) {
                console.error(error);
              }
            }
            setLoading(false);
          }}
        >
          {files.length <= 1 ? (
            <Center h={"100%"}>
              <Group>
                <Stack>
                  <Center>
                    <ThemeIcon variant="transparent" size={"10rem"} className={styles.folderIcon}>
                      <IconFolderUp style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                  </Center>
                  <Title ta={"center"} className={styles.noFilesTitle}>No has subido ningún archivo</Title>
                  <Text ta={"center"} className={styles.noFilesText}>Sube uno para empezar</Text>
                </Stack>
              </Group>
            </Center>
          ) : null}
        </Dropzone>
        <Grid className={styles.fileGrid}>
          {files.map((file, index) => {
            if (file.name.startsWith(".")) return null;
            return (
              <Grid.Col key={file.name} >
                <Card withBorder radius="md" shadow="md" className={styles.fileCard}>
                  <Stack>
                    <Center>
                      <ThemeIcon variant="transparent" size={"5rem"} className={styles.fileIcon}>
                        <IconFileTypePdf style={{ width: "70%", height: "70%" }} />
                      </ThemeIcon>
                    </Center>
                    <Text ta={"center"} className={styles.fileName}>{file.name}</Text>
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
        <Text
          onClick={() => setModalOpened(true)}
          className={styles.termsText}
          ta="center"
        >
          Lea y acepte los términos y condiciones de tratamiento de datos.
        </Text>
        <Checkbox
          label="He leído y acepto los términos y condiciones de tratamiento de datos."
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
          className={styles.checkbox}
          disabled={!termsAccepted}
        />
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Términos y Condiciones"
        size="lg"
        centered
      >
        <ScrollArea
          style={{ height: 300 }}
          type="always"
          offsetScrollbars
          onScrollPositionChange={handleScroll}
          ref={scrollAreaRef}
        >
          <Text>
            Aquí van los términos y condiciones detallados sobre el tratamiento de datos.
            <br /><br />
            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            <br />
            2. Donec vehicula cursus vestibulum.
            <br />
            3. Quisque elementum turpis eu lacus accumsan, nec bibendum ligula convallis.
            <br />
            4. Phasellus suscipit ex eget augue congue, nec bibendum mi tempor.
            <br />
            5. Aenean fermentum ligula vel nulla tincidunt, nec ultrices libero elementum.
            <br />
            6. Curabitur quis tortor et dui varius cursus.
            <br />
            7. In hac habitasse platea dictumst.
            <br />
            8. Nulla facilisi.
            <br />
            9. Etiam tincidunt sapien et lorem interdum fermentum.
            <br />
            10. Ut id velit non magna bibendum aliquam.
            <br /><br />
            [CONTINUA...]
          </Text>
        </ScrollArea>
        <Group gap="right" mt="md">
          <Button
            onClick={() => {
              setTermsScrolled(true);
              setModalOpened(false);
              setTermsAccepted(true);
            }}
            disabled={!termsScrolled}
          >
            He leído y acepto
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default FilesPage;
