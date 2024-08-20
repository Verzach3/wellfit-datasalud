import { Card, Container, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getFiles } from "../../functions/getFiles.telefunc.js";
import UserFiles from "@/components/admin/UserFiles.jsx";

function AdminPage() {
  const [files, setFiles] = useState<Awaited<ReturnType<typeof getFiles>>>([]);
  useEffect(() => {
    (async () => {
      const files = await getFiles();
      setFiles(files);
    })();
  }, []);

  if (("error" in files && files.error) || !Array.isArray(files)) {
    return (
      <Container mt={"md"}>
        <Text>{files.error}</Text>
      </Container>
    );
  }

  return (
    <Container mt={"md"}>
      <Title ta={"center"} mb={"md"}>Lista de archivos</Title>
      <ScrollArea>
        <Stack>
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
