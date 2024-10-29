import { useEffect, useState } from "react";
import { Card, Container, Group, Loader, Text, Title, Stack } from "@mantine/core";
import { getPatientCount } from "@/functions/getPatientCount.telefunc";
import { getReportCount } from "@/functions/getReportCount.telefunc";
import { getPatientsByOrganization } from "@/functions/getPatientsByOrganization.telefunc";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import classes from "./page.module.css";

// Registrar plugins
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function IndexView() {
  const [patientCount, setPatientCount] = useState<number>(0);
  const [reportCount, setReportCount] = useState<number>(0);
  const [patientsByOrg, setPatientsByOrg] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const patientCountRes = await getPatientCount();
      const reportCountRes = await getReportCount();
      const patientsByOrgRes = await getPatientsByOrganization();

      setPatientCount(patientCountRes?.count ?? 0);
      setReportCount(reportCountRes?.count ?? 0);
      setPatientsByOrg(patientsByOrgRes?.patientsByOrganization ?? {});

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className={classes.loaderContainer}>
        <Loader size="xl" color="blue" />
      </Container>
    );
  }

  const orgLabels = Object.keys(patientsByOrg);
  const orgData = Object.values(patientsByOrg);

  // Datos y opciones para la gráfica de barras
  const barData = {
    labels: orgLabels,
    datasets: [
      {
        label: "Pacientes por Organización",
        data: orgData,
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#000",
        anchor: "end" as const, // Ajustado
        align: "end" as const, // Ajustado
        formatter: (value: number) => value.toLocaleString(),
        font: {
          weight: "bold" as const, // Cambiado de string genérico a literal
        },
      },
    },
  };

  // Datos y opciones para la gráfica de Doughnut
  const doughnutData = {
    labels: ["Reportes Generados", "Sin Reporte"],
    datasets: [
      {
        data: [reportCount, Math.max(patientCount - reportCount, 0)],
        backgroundColor: ["#4bc0c0", "#ff6384"],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#fff",
        anchor: "center" as const, // Ajustado
        align: "center" as const, // Ajustado
        formatter: (value: number) => value.toLocaleString(),
        font: { weight: "bold" as const, size: 14 },
      },
    },
  };

  return (
    <Container size="md" className={classes.statsContainer}>
      <Title order={2} className={classes.title}>
        Estadísticas Generales de DataSalud
      </Title>

      <Stack gap="lg" className={classes.statsStack}>
        <Card className={classes.statCard}>
          <Text size="xl" fw={700} ta="center" color="teal">
            Pacientes Registrados
          </Text>
          <Text size="lg" ta="center" className={classes.counter}>
            {patientCount.toLocaleString()}
          </Text>
          <Text ta="center" className={classes.description}>
            Actualmente, DataSalud cuenta con un total de {patientCount.toLocaleString()} pacientes registrados,
            quienes están recibiendo atención y monitoreo integral.
          </Text>
        </Card>

        <Card className={classes.statCard}>
          <Text size="xl" fw={700} ta="center" color="blue">
            Pacientes por Organización
          </Text>
          <div className={classes.chartContainer}>
            <Bar data={barData} options={barOptions} />
          </div>
          <Text ta="center" className={classes.description}>
            Distribución de pacientes entre diferentes organizaciones asociadas, brindando
            una visión detallada del alcance de DataSalud en el sector.
          </Text>
        </Card>

        <Card className={classes.statCard}>
          <Text size="xl" fw={700} ta="center" color="orange">
            Reportes Generados
          </Text>
          <div className={classes.chartContainer}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <Text ta="center" className={classes.description}>
            Hasta la fecha, se han generado {reportCount.toLocaleString()} reportes médicos para apoyar la
            toma de decisiones clínicas, garantizando un cuidado continuo y personalizado.
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}

export default IndexView;
