import React, { useEffect, useState } from "react";
import { Card, Container, ScrollArea, Stack, Text, Title, Loader } from "@mantine/core";
import { getFiles } from "../../functions/getFiles.telefunc.js";
import UserFiles from "@/components/admin/UserFiles.jsx";
import classes from './Page.module.css';

function AdminPage() {
  const [files, setFiles] = useState<Awaited<ReturnType<typeof getFiles>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const fetchedFiles = await getFiles();
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
        <Text color="red" size="lg">{files.error}</Text>
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
      <ScrollArea className={classes.scrollArea}>
        <Stack gap="lg">
          {files.map((file) => (
            <UserFiles
              key={file.name}
              birth_date={file.userProfile?.birth_date ?? ""}
              cedula={file.userProfile?.cedula ?? ""}
              lastname={file.userProfile?.first_lastname ?? ""}
              name={file.userProfile?.first_name ?? ""}
              folder_name={file.name}
            />
          ))}
        </Stack>
      </ScrollArea>
    </Container>
  );
}

export default AdminPage;
