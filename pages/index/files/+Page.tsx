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
} from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import {
  IconFileTypePdf,
  IconFolderFilled,
  IconFolderUp,
  IconUpload,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import {} from "@supabase/supabase-js";

function FilesPage() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const openRef = useRef<() => void>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.storage
        .from("patient-documents")
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

  return (
    <Container h={"90dvh"}>
      <Card withBorder w={"100%"} mt={"xl"} h={"92dvh"}>
        <Card.Section>
          <Card
            withBorder
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Group justify="space-between">
              <Text>Archivos Subidos Anteriormente</Text>
              <Button
                onClick={() => openRef.current?.()}
                rightSection={<IconUpload size={"1.2rem"} />}
              >
                Subir Archivo
              </Button>
            </Group>
          </Card>
        </Card.Section>
        <Dropzone
          openRef={openRef}
          loading={loading}
          style={{
            border: 0,
            height: "100%",
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
                    `${
                      (
                        await supabase.auth.getSession()
                      ).data.session?.user.id
                    }/${file.name}`,
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
                    <ThemeIcon variant="transparent" size={"10rem"} c={"gray"}>
                      <IconFolderUp style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                  </Center>
                  <Title ta={"center"}>No has subido ningun archivo</Title>
                  <Text ta={"center"}>Sube uno para empezar</Text>
                </Stack>
              </Group>
            </Center>
          ) : null}
        </Dropzone>
        <Grid mt={"md"}>
          {files.map((file, index) => {
            if (file.name.startsWith(".")) return null;
            return (
              <Card key={file.name} withBorder radius={0} shadow="md">
                <Stack>
                  <Center>
                    <ThemeIcon variant="transparent" size={"5rem"} c={"gray"}>
                      <IconFileTypePdf
                        style={{ width: "70%", height: "70%" }}
                      />
                    </ThemeIcon>
                  </Center>
                  <Text ta={"center"}>{file.name}</Text>
                </Stack>
              </Card>
            );
          })}
        </Grid>
      </Card>
    </Container>
  );
}

export default FilesPage;
