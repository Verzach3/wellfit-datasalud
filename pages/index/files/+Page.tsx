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
  List,
  Paper,
  Divider,
} from '@mantine/core';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import {
  IconFileTypePdf,
  IconFolderUp,
  IconUpload,
  IconAlertCircle,
  IconRobot,
  IconUserCheck,
  IconNotes,
  IconStethoscope,
} from '@tabler/icons-react';
import { } from '@supabase/supabase-js';  // Asegúrate de tener esta importación correcta
import styles from './Page.module.css';

function FilesPage() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  
  // Evitamos el uso de localStorage en SSR
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Solo accedemos a localStorage en el lado del cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTerms = localStorage.getItem('termsAccepted');
      setTermsAccepted(storedTerms === 'true');
    }
  }, []);
  
  const [modalOpened, setModalOpened] = useState(false);
  const [notificacionModalOpened, setNotificacionModalOpened] = useState(false);
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

  const handleTermsAccept = () => {
    setTermsScrolled(true);
    setModalOpened(false);
    setTermsAccepted(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('termsAccepted', 'true');
    }
    
    setNotificacionModalOpened(true);
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
          <div className="termsContent">

<h2 className="termsTitle">LEY ESTATUTARIA 1581 DE 2012</h2>
<p className="termsParagraph">
  Reglamentada parcialmente por el Decreto Nacional 1377 de 2013, Reglamentada Parcialmente por el Decreto 1081 de 2015. Ver sentencia C-748 de 2011. Ver Decreto 255 de 2022.
</p>
<p className="termsParagraph">
  Por la cual se dictan disposiciones generales para la protección de datos personales.
</p>

<h3 className="termsSubTitle">EL CONGRESO DE COLOMBIA</h3>
<h3 className="termsSubTitle">DECRETA:</h3>

<h2 className="termsTitle">TÍTULO I - OBJETO, ÁMBITO DE APLICACIÓN Y DEFINICIONES</h2>

<h3 className="termsSubTitle">Artículo 1°. Objeto.</h3>
<p className="termsParagraph">
  La presente ley tiene por objeto desarrollar el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bases de datos o archivos, y los demás derechos, libertades y garantías constitucionales a que se refiere el artículo 15 de la Constitución Política; así como el derecho a la información consagrado en el artículo 20 de la misma.
</p>

<h3 className="termsSubTitle">Artículo 2°. Ámbito de aplicación.</h3>
<p className="termsParagraph">
  Los principios y disposiciones contenidas en la presente ley serán aplicables a los datos personales registrados en cualquier base de datos que los haga susceptibles de tratamiento por entidades de naturaleza pública o privada.
</p>
<p className="termsParagraph">
  La presente ley aplicará al tratamiento de datos personales efectuado en territorio colombiano o cuando al Responsable del Tratamiento o Encargado del Tratamiento no establecido en territorio nacional le sea aplicable la legislación colombiana en virtud de normas y tratados internacionales.
</p>

<h3 className="termsSubTitle">Exclusiones:</h3>
<ul className="termsList">
  <li>a) A las bases de datos o archivos mantenidos en un ámbito exclusivamente personal o doméstico.</li>
  <li>b) A las bases de datos y archivos que tengan por finalidad la seguridad y defensa nacional, así como la prevención, detección, monitoreo y control del lavado de activos y el financiamiento del terrorismo;</li>
  <li>c) A las Bases de datos que tengan como fin y contengan información de inteligencia y contrainteligencia;</li>
  <li>d) A las bases de datos y archivos de información periodística y otros contenidos editoriales;</li>
  <li>e) A las bases de datos y archivos regulados por la Ley 1266 de 2008;</li>
  <li>f) A las bases de datos y archivos regulados por la Ley 79 de 1993.</li>
</ul>

<h3 className="termsSubTitle">Parágrafo.</h3>
<p className="termsParagraph">
  Los principios sobre protección de datos serán aplicables a todas las bases de datos, incluidas las exceptuadas en el presente artículo, con los límites dispuestos en la presente ley y sin reñir con los datos que tienen características de estar amparados por la reserva legal. En el evento que la normatividad especial que regule las bases de datos exceptuadas prevea principios que tengan en consideración la naturaleza especial de datos, los mismos aplicarán de manera concurrente a los previstos en la presente ley.
</p>

<h3 className="termsSubTitle">Artículo 3°. Definiciones.</h3>
<p className="termsParagraph">
  Para los efectos de la presente ley, se entiende por:
</p>
<ul className="termsList">
  <li><strong>a)</strong> Autorización: Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales;</li>
  <li><strong>b)</strong> Base de Datos: Conjunto organizado de datos personales que sea objeto de Tratamiento;</li>
  <li><strong>c)</strong> Dato personal: Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables;</li>
  <li><strong>d)</strong> Encargado del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de datos personales por cuenta del Responsable del Tratamiento;</li>
  <li><strong>e)</strong> Responsable del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el Tratamiento de los datos;</li>
  <li><strong>f)</strong> Titular: Persona natural cuyos datos personales sean objeto de Tratamiento;</li>
  <li><strong>g)</strong> Tratamiento: Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.</li>
</ul>

<h2 className="termsTitle">TÍTULO II - PRINCIPIOS RECTORES</h2>

<h3 className="termsSubTitle">Artículo 4°. Principios para el Tratamiento de datos personales.</h3>
<p className="termsParagraph">
  En el desarrollo, interpretación y aplicación de la presente ley, se aplicarán, de manera armónica e integral, los siguientes principios:
</p>

<ul className="termsList">
  <li><strong>a)</strong> Principio de legalidad en materia de Tratamiento de datos: El Tratamiento a que se refiere la presente ley es una actividad reglada que debe sujetarse a lo establecido en ella y en las demás disposiciones que la desarrollen;</li>
  <li><strong>b)</strong> Principio de finalidad: El Tratamiento debe obedecer a una finalidad legítima de acuerdo con la Constitución y la Ley, la cual debe ser informada al Titular;</li>
  <li><strong>c)</strong> Principio de libertad: El Tratamiento sólo puede ejercerse con el consentimiento, previo, expreso e informado del Titular;</li>
  <li><strong>d)</strong> Principio de veracidad o calidad: La información sujeta a Tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible;</li>
  <li><strong>e)</strong> Principio de transparencia: En el Tratamiento debe garantizarse el derecho del Titular a obtener del Responsable del Tratamiento o del Encargado del Tratamiento, en cualquier momento y sin restricciones, información acerca de la existencia de datos que le conciernan;</li>
  <li><strong>f)</strong> Principio de acceso y circulación restringida: El Tratamiento se sujeta a los límites que se derivan de la naturaleza de los datos personales;</li>
  <li><strong>g)</strong> Principio de seguridad: La información sujeta a Tratamiento debe manejarse con las medidas técnicas, humanas y administrativas necesarias;</li>
  <li><strong>h)</strong> Principio de confidencialidad: Todas las personas que intervengan en el Tratamiento de datos personales están obligadas a garantizar la reserva de la información.</li>
</ul>

<h2 className="termsTitle">TÍTULO III - CATEGORÍAS ESPECIALES DE DATOS</h2>

<h3 className="termsSubTitle">Artículo 5°. Datos sensibles.</h3>
<p className="termsParagraph">
  Para los propósitos de la presente ley, se entiende por datos sensibles aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos, así como los datos relativos a la salud, a la vida sexual y los datos biométricos.
</p>

<h3 className="termsSubTitle">Artículo 6°. Tratamiento de datos sensibles.</h3>
<p className="termsParagraph">
  Se prohíbe el Tratamiento de datos sensibles, excepto cuando:
</p>
<ul className="termsList">
  <li><strong>a)</strong> El Titular haya dado su autorización explícita a dicho Tratamiento;</li>
  <li><strong>b)</strong> El Tratamiento sea necesario para salvaguardar el interés vital del Titular;</li>
  <li><strong>c)</strong> El Tratamiento sea efectuado en el curso de las actividades legítimas por parte de una fundación o una ONG;</li>
  <li><strong>d)</strong> El Tratamiento se refiera a datos que sean necesarios para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial;</li>
  <li><strong>e)</strong> El Tratamiento tenga una finalidad histórica, estadística o científica.</li>
</ul>
<h3 className="termsSubTitle">Artículo 7°. Derechos de los niños, niñas y adolescentes.</h3>
<p className="termsParagraph">
En el Tratamiento se asegurará el respeto a los derechos prevalentes de los niños, niñas y adolescentes.
</p>
<p className="termsParagraph">
Queda proscrito el Tratamiento de datos personales de niños, niñas y adolescentes, salvo aquellos datos que sean de naturaleza pública.
</p>
<p className="termsParagraph">
Es tarea del Estado y las entidades educativas de todo tipo proveer información y capacitar a los representantes legales y tutores sobre los eventuales riesgos a los que se enfrentan los niños, niñas y adolescentes respecto del Tratamiento indebido de sus datos personales, y proveer de conocimiento acerca del uso responsable y seguro por parte de niños, niñas y adolescentes de sus datos personales, su derecho a la privacidad y protección de su información personal y la de los demás. El Gobierno Nacional reglamentará la materia, dentro de los seis (6) meses siguientes a la promulgación de esta ley.
</p>

<h2 className="termsTitle">TÍTULO IV - DERECHOS Y CONDICIONES DE LEGALIDAD PARA EL TRATAMIENTO DE DATOS</h2>

<h3 className="termsSubTitle">Artículo 8°. Derechos de los Titulares.</h3>
<p className="termsParagraph">
El Titular de los datos personales tendrá los siguientes derechos:
</p>

<ul className="termsList">
<li><strong>a)</strong> Conocer, actualizar y rectificar sus datos personales frente a los Responsables del Tratamiento o Encargados del Tratamiento. Este derecho se podrá ejercer, entre otros, frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté expresamente prohibido o no haya sido autorizado;</li>
<li><strong>b)</strong> Solicitar prueba de la autorización otorgada al Responsable del Tratamiento, salvo cuando expresamente se exceptúe como requisito para el Tratamiento;</li>
<li><strong>c)</strong> Ser informado por el Responsable del Tratamiento o el Encargado del Tratamiento, previa solicitud, respecto del uso que le ha dado a sus datos personales;</li>
<li><strong>d)</strong> Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la presente ley;</li>
<li><strong>e)</strong> Revocar la autorización y/o solicitar la supresión del dato cuando en el Tratamiento no se respeten los principios, derechos y garantías constitucionales y legales;</li>
<li><strong>f)</strong> Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento.</li>
</ul>

<h3 className="termsSubTitle">Artículo 9°. Autorización del Titular.</h3>
<p className="termsParagraph">
Sin perjuicio de las excepciones previstas en la ley, en el Tratamiento se requiere la autorización previa e informada del Titular, la cual deberá ser obtenida por cualquier medio que pueda ser objeto de consulta posterior.
</p>

<h3 className="termsSubTitle">Artículo 10. Casos en que no es necesaria la autorización.</h3>
<p className="termsParagraph">
La autorización del Titular no será necesaria cuando se trate de:
</p>

<ul className="termsList">
<li><strong>a)</strong> Información requerida por una entidad pública o administrativa en ejercicio de sus funciones legales o por orden judicial;</li>
<li><strong>b)</strong> Datos de naturaleza pública;</li>
<li><strong>c)</strong> Casos de urgencia médica o sanitaria;</li>
<li><strong>d)</strong> Tratamiento de información autorizado por la ley para fines históricos, estadísticos o científicos;</li>
<li><strong>e)</strong> Datos relacionados con el Registro Civil de las Personas.</li>
</ul>

<h3 className="termsSubTitle">Artículo 11. Suministro de la información.</h3>
<p className="termsParagraph">
La información solicitada podrá ser suministrada por cualquier medio, incluyendo los electrónicos, según lo requiera el Titular. La información deberá ser de fácil lectura, sin barreras técnicas que impidan su acceso y deberá corresponder en un todo a aquella que repose en la base de datos.
</p>

<h3 className="termsSubTitle">Artículo 12. Deber de informar al Titular.</h3>
<p className="termsParagraph">
El Responsable del Tratamiento, al momento de solicitar al Titular la autorización, deberá informarle de manera clara y expresa lo siguiente:
</p>

<ul className="termsList">
<li><strong>a)</strong> El Tratamiento al cual serán sometidos sus datos personales y la finalidad del mismo;</li>
<li><strong>b)</strong> El carácter facultativo de la respuesta a las preguntas que le sean hechas, cuando estas versen sobre datos sensibles o sobre los datos de las niñas, niños y adolescentes;</li>
<li><strong>c)</strong> Los derechos que le asisten como Titular;</li>
<li><strong>d)</strong> La identificación, dirección física o electrónica y teléfono del Responsable del Tratamiento.</li>
</ul>

<h3 className="termsSubTitle">Artículo 13. Personas a quienes se les puede suministrar la información.</h3>
<p className="termsParagraph">
La información que reúna las condiciones establecidas en la presente ley podrá suministrarse a las siguientes personas:
</p>

<ul className="termsList">
<li><strong>a)</strong> A los Titulares, sus causahabientes o sus representantes legales;</li>
<li><strong>b)</strong> A las entidades públicas o administrativas en ejercicio de sus funciones legales o por orden judicial;</li>
<li><strong>c)</strong> A los terceros autorizados por el Titular o por la ley.</li>
</ul>

<h2 className="termsTitle">TÍTULO V - PROCEDIMIENTOS</h2>

<h3 className="termsSubTitle">Artículo 14. Consultas.</h3>
<p className="termsParagraph">
Los Titulares o sus causahabientes podrán consultar la información personal del Titular que repose en cualquier base de datos, sea esta del sector público o privado. El Responsable del Tratamiento o Encargado del Tratamiento deberán suministrar a estos toda la información contenida en el registro individual o que esté vinculada con la identificación del Titular.
</p>

<h3 className="termsSubTitle">Artículo 15. Reclamos.</h3>
<p className="termsParagraph">
El Titular o sus causahabientes que consideren que la información contenida en una base de datos debe ser objeto de corrección, actualización o supresión, o cuando adviertan el presunto incumplimiento de cualquiera de los deberes contenidos en esta ley, podrán presentar un reclamo ante el Responsable del Tratamiento o el Encargado del Tratamiento.
</p>
<p className="termsParagraph">
El reclamo será tramitado bajo las siguientes reglas:
</p>

<ol className="termsList">
<li>El reclamo se formulará mediante solicitud dirigida al Responsable del Tratamiento o al Encargado del Tratamiento, con la identificación del Titular, la descripción de los hechos que dan lugar al reclamo, la dirección, y acompañando los documentos que se quiera hacer valer.</li>
<li>Una vez recibido el reclamo completo, se incluirá en la base de datos una leyenda que diga "reclamo en trámite".</li>
<li>El término máximo para atender el reclamo será de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recibo.</li>
</ol>
<h2 className="termsTitle">TÍTULO VI - PROCEDIMIENTOS Y SANCIONES</h2>

<h3 className="termsSubTitle">Artículo 22. Trámite.</h3>
<p className="termsParagraph">
La Superintendencia de Industria y Comercio, una vez establecido el incumplimiento de las disposiciones de la presente ley por parte del Responsable del Tratamiento o el Encargado del Tratamiento, adoptará las medidas o impondrá las sanciones correspondientes.
</p>
<p className="termsParagraph">
En lo no reglado por la presente ley y los procedimientos correspondientes se seguirán las normas pertinentes del Código Contencioso Administrativo.
</p>

<h3 className="termsSubTitle">Artículo 23. Sanciones.</h3>
<p className="termsParagraph">
La Superintendencia de Industria y Comercio podrá imponer a los Responsables del Tratamiento y Encargados del Tratamiento las siguientes sanciones:
</p>

<ul className="termsList">
<li><strong>a)</strong> Multas de carácter personal e institucional hasta por el equivalente de dos mil (2.000) salarios mínimos mensuales legales vigentes al momento de la imposición de la sanción.</li>
<li><strong>b)</strong> Suspensión de las actividades relacionadas con el Tratamiento hasta por un término de seis (6) meses.</li>
<li><strong>c)</strong> Cierre temporal de las operaciones relacionadas con el Tratamiento una vez transcurrido el término de suspensión.</li>
<li><strong>d)</strong> Cierre inmediato y definitivo de la operación que involucre el Tratamiento de datos sensibles.</li>
</ul>

<h3 className="termsSubTitle">Parágrafo.</h3>
<p className="termsParagraph">
Las sanciones indicadas en el presente artículo sólo aplican para las personas de naturaleza privada. En el evento en el cual la Superintendencia de Industria y Comercio advierta un presunto incumplimiento de una autoridad pública a las disposiciones de la presente ley, remitirá la actuación a la Procuraduría General de la Nación para que adelante la investigación respectiva.
</p>

<h3 className="termsSubTitle">Artículo 24. Criterios para graduar las sanciones.</h3>
<p className="termsParagraph">
Las sanciones por infracciones a las que se refiere el artículo anterior, se graduarán atendiendo los siguientes criterios, en cuanto resulten aplicables:
</p>

<ul className="termsList">
<li><strong>a)</strong> La dimensión del daño o peligro a los intereses jurídicos tutelados por la presente ley.</li>
<li><strong>b)</strong> El beneficio económico obtenido por el infractor o terceros.</li>
<li><strong>c)</strong> La reincidencia en la comisión de la infracción.</li>
<li><strong>d)</strong> La resistencia, negativa u obstrucción a la acción investigadora o de vigilancia de la Superintendencia de Industria y Comercio.</li>
<li><strong>e)</strong> La renuencia o desacato a cumplir las órdenes impartidas por la Superintendencia de Industria y Comercio.</li>
<li><strong>f)</strong> El reconocimiento o aceptación expresos que haga el investigado sobre la comisión de la infracción antes de la imposición de la sanción a que hubiere lugar.</li>
</ul>

<h2 className="termsTitle">CAPÍTULO III - DEL REGISTRO NACIONAL DE BASES DE DATOS</h2>

<h3 className="termsSubTitle">Artículo 25. Definición.</h3>
<p className="termsParagraph">
Reglamentado por el Decreto Nacional 886 de 2014. El Registro Nacional de Bases de Datos es el directorio público de las bases de datos sujetas a Tratamiento que operan en el país. El registro será administrado por la Superintendencia de Industria y Comercio y será de libre consulta para los ciudadanos.
</p>
<p className="termsParagraph">
Para realizar el registro de bases de datos, los interesados deberán aportar a la Superintendencia de Industria y Comercio las políticas de tratamiento de la información, las cuales obligarán a los responsables y encargados del mismo, y cuyo incumplimiento acarreará las sanciones correspondientes. Las políticas de Tratamiento en ningún caso podrán ser inferiores a los deberes contenidos en la presente ley.
</p>
<p className="termsParagraph">
<strong>Parágrafo.</strong> El Gobierno Nacional reglamentará, dentro del año siguiente a la promulgación de la presente ley, la información mínima que debe contener el Registro, y los términos y condiciones bajo los cuales se deben inscribir en este los Responsables del Tratamiento.
</p>

<h2 className="termsTitle">TÍTULO VIII - TRANSFERENCIA DE DATOS A TERCEROS PAÍSES</h2>

<h3 className="termsSubTitle">Artículo 26. Prohibición.</h3>
<p className="termsParagraph">
Se prohíbe la transferencia de datos personales de cualquier tipo a países que no proporcionen niveles adecuados de protección de datos. Se entiende que un país ofrece un nivel adecuado de protección de datos cuando cumpla con los estándares fijados por la Superintendencia de Industria y Comercio sobre la materia.
</p>

<p className="termsParagraph">
Esta prohibición no regirá cuando se trate de:
</p>

<ul className="termsList">
<li><strong>a)</strong> Información respecto de la cual el Titular haya otorgado su autorización expresa e inequívoca para la transferencia;</li>
<li><strong>b)</strong> Intercambio de datos de carácter médico, cuando así lo exija el Tratamiento del Titular por razones de salud o higiene pública;</li>
<li><strong>c)</strong> Transferencias bancarias o bursátiles, conforme a la legislación que les resulte aplicable;</li>
<li><strong>d)</strong> Transferencias acordadas en el marco de tratados internacionales en los cuales la República de Colombia sea parte;</li>
<li><strong>e)</strong> Transferencias necesarias para la ejecución de un contrato entre el Titular y el Responsable del Tratamiento;</li>
<li><strong>f)</strong> Transferencias legalmente exigidas para la salvaguardia del interés público, o para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial.</li>
</ul>

<h3 className="termsSubTitle">Parágrafo 1°.</h3>
<p className="termsParagraph">
En los casos no contemplados como excepción en el presente artículo, corresponderá a la Superintendencia de Industria y Comercio, proferir la declaración de conformidad relativa a la transferencia internacional de datos personales.
</p>

<h3 className="termsSubTitle">Parágrafo 2°.</h3>
<p className="termsParagraph">
Las disposiciones contenidas en el presente artículo serán aplicables para todos los datos personales, incluyendo aquellos contemplados en la Ley 1266 de 2008.
</p>

<h2 className="termsTitle">TÍTULO IX - OTRAS DISPOSICIONES</h2>

<h3 className="termsSubTitle">Artículo 27. Normas Corporativas Vinculantes.</h3>
<p className="termsParagraph">
El Gobierno Nacional expedirá la reglamentación correspondiente sobre Normas Corporativas Vinculantes para la certificación de buenas prácticas en protección de datos personales y su transferencia a terceros países.
</p>

<h3 className="termsSubTitle">Artículo 28. Régimen de transición.</h3>
<p className="termsParagraph">
Las personas que a la fecha de entrada en vigencia de la presente ley ejerzan alguna de las actividades acá reguladas tendrán un plazo de hasta seis (6) meses para adecuarse a las disposiciones contempladas en esta ley.
</p>

<h3 className="termsSubTitle">Artículo 29. Derogatorias.</h3>
<p className="termsParagraph">
La presente ley deroga todas las disposiciones que le sean contrarias a excepción de aquellas contempladas en el artículo 2°.
</p>

<h3 className="termsSubTitle">Artículo 30. Vigencia.</h3>
<p className="termsParagraph">
La presente ley rige a partir de su promulgación.
</p>


</div>
          </Text>
        </ScrollArea>
        <Group gap="right" mt="md">
          <Button
            onClick={handleTermsAccept}
            disabled={!termsScrolled}
          >
            He leído y acepto
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={notificacionModalOpened}
        onClose={() => setNotificacionModalOpened(false)}
        title={
          <Group>
            <IconAlertCircle size={24} color="blue" />
            <Text size="xl" fw={700}>Información Importante</Text>
          </Group>
        }
        size="lg"
        centered
        className={styles.notificacionModal}
      >
        <Paper shadow="sm" p="md" withBorder className={styles.notificacionPaper}>
          <Text className={styles.notificacionText}>
            Has aceptado los términos y condiciones. Por favor, ten en cuenta la siguiente información importante:
          </Text>
          <Divider my="sm" />
          <List spacing="md" size="sm" center icon={<ThemeIcon color="blue" size={24} radius="xl"><IconAlertCircle size={16} /></ThemeIcon>}>
            <List.Item icon={<ThemeIcon color="teal" size={24} radius="xl"><IconRobot size={16} /></ThemeIcon>}>
              La documentación que subas será procesada por inteligencia artificial para generar tu perfil médico.
            </List.Item>
            <List.Item icon={<ThemeIcon color="grape" size={24} radius="xl"><IconNotes size={16} /></ThemeIcon>}>
              Las recomendaciones generadas se basan en el análisis de tus datos médicos.
            </List.Item>
            <List.Item icon={<ThemeIcon color="orange" size={24} radius="xl"><IconUserCheck size={16} /></ThemeIcon>}>
              Entiendes que las sugerencias provienen de una IA y no sustituyen el consejo médico profesional.
            </List.Item>
            <List.Item icon={<ThemeIcon color="pink" size={24} radius="xl"><IconUserCheck size={16} /></ThemeIcon>}>
              Eres responsable de tomar decisiones informadas basadas en estas recomendaciones.
            </List.Item>
            <List.Item icon={<ThemeIcon color="indigo" size={24} radius="xl"><IconStethoscope size={16} /></ThemeIcon>}>
              Consulta siempre con un médico antes de realizar cualquier cambio en tu tratamiento o salud.
            </List.Item>
          </List>
        </Paper>
        <Button onClick={() => setNotificacionModalOpened(false)} fullWidth mt="xl" size="md" className={styles.notificacionButton}>
          Entendido
        </Button>
      </Modal>
    </Container>
  );
}

export default FilesPage;
