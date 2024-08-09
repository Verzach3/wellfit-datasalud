import { Container, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { getFiles } from "../../functions/getFiles.telefunc.js";

function AdminPage() {
  useEffect(() => {
    getFiles();
  }, [])
  return (
    <Container mt={"md"}>
      <Title ta={"center"}>
        Lista de archivos
      </Title>
    </Container> 
  )
}

export default AdminPage; 