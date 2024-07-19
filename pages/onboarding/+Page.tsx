import { type Static, Type } from "@sinclair/typebox";
import {
  Button,
  Center,
  Container,
  Image,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { navigate } from "vike/client/router";

const ProfileValidator = Type.Object({
  name: Type.String({ minLength: 2 }),
  second_name: Type.Optional(Type.String()),
  lastname: Type.String({ minLength: 2 }),
  second_lastname: Type.Optional(Type.String()),
  birth_date: Type.Date(),
  gender: Type.Union([Type.Literal("M"), Type.Literal("F")]),
  phone: Type.String(),
});

type ProfileValidatorType = Static<typeof ProfileValidator>;

function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      second_name: "",
      lastname: "",
      second_lastname: "",
      birth_date: new Date(),
      gender: "M",
      phone: "",
    },

    validate: {
      name: (value) => (value.length > 2 ? null : "Nombre invalido"),
      lastname: (value) => (value.length > 2 ? null : "Apellido invalido"),
      gender: (value) =>
        value === "M" || value === "F" ? null : "Opcion invalida",
    },
  });

  async function completeProfile(profile: ProfileValidatorType) {
    setLoading(true);

    setLoading(false);
  }

  return (
    <Container fluid mt={"1.5rem"} pb={"5rem"}>
      <Center>
        <Stack>
          <Center>
            <Image src={"/assets/wellfit-bottom-text.svg"} h={230} w={"auto"} />
          </Center>
          <form
            onSubmit={form.onSubmit((values) =>
              completeProfile(values as ProfileValidatorType),
            )}
          >
            <Title ta={"center"}>Terminemos tu perfil</Title>
            <Text ta={"center"} fw={600} c={"gray"}>
              Para poder brindarte un mejor servicio, necesitamos conocer mas de
              ti.
            </Text>
            <TextInput
              label={"Nombre"}
              required
              mt={"2rem"}
              {...form.getInputProps("name")}
            />
            <TextInput
              label={"Segundo Nombre (Opcional)"}
              {...form.getInputProps("second_name")}
            />
            <TextInput
              label={"Apellido"}
              required
              {...form.getInputProps("lastname")}
            />
            <TextInput
              label={"Segundo Apellido (Opcional)"}
              {...form.getInputProps("second_lastname")}
            />
            <DateInput
              label={"Fecha de nacimiento"}
              required
              {...form.getInputProps("birth_date")}
            />
            <Select
              label={"Genero asignado al nacer"}
              data={[
                { label: "Masculino", value: "M" },
                { label: "Femenino", value: "F" },
              ]}
              required
              {...form.getInputProps("gender")}
            />
            <TextInput
              label={"Numero de telefono"}
              {...form.getInputProps("phone")}
            />
            <Button mt={"2rem"} type={"submit"} w={"100%"} loading={loading}>
              Continuar
            </Button>
          </form>
        </Stack>
      </Center>
    </Container>
  );
}

export default ProfileForm;
