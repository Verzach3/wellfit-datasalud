import React, { useState } from 'react';
import { Button, Drawer } from '@mantine/core';
import { IconHelpCircle, IconBrandWhatsapp } from '@tabler/icons-react';
import classes from './page.module.css';

const SupportButton = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);

  const handleOptionClick = (option: 'petition' | 'complaint' | 'claim' | 'suggestion') => {
    const forms = {
      petition: 'https://forms.google.com/petition',
      complaint: 'https://forms.google.com/complaint',
      claim: 'https://forms.google.com/claim',
      suggestion: 'https://forms.google.com/suggestion',
    };
    window.open(forms[option], '_blank');
    setDrawerOpened(false); // Cerrar drawer después de click
  };

  const handleWhatsappClick = () => {
    const message = "Hola, necesito ayuda urgente para mi proceso de Data Salud.";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setDrawerOpened(false); // Cerrar drawer después de click
  };

  return (
    <>
      <Button
  onClick={() => setDrawerOpened(true)}
  className={classes.supportButton}
  data-drawer-opened={drawerOpened}
  leftSection={<IconHelpCircle className={classes.buttonIcon} size={24} />}
>
  <span className={classes.buttonText}>Soporte</span>
</Button>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Opciones de Soporte"
        padding="xl"
        size="sm"
        position="right"
        withCloseButton
        styles={{
          header: {
            background: 'linear-gradient(135deg, #0077be, #00a86b)',
            color: 'white',
            padding: '20px',
          },
          title: {
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
          },
          close: {
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          },
          body: {
            padding: '20px',
          },
        }}
      >
        <div className={classes.drawerContent}>
          <Button
            onClick={() => handleOptionClick('petition')}
            fullWidth
            className={classes.subButton}
            variant="light"
          >
            Realizar una petición
          </Button>
          <Button
            onClick={() => handleOptionClick('complaint')}
            fullWidth
            className={classes.subButton}
            variant="light"
          >
            Realizar una queja
          </Button>
          <Button
            onClick={() => handleOptionClick('claim')}
            fullWidth
            className={classes.subButton}
            variant="light"
          >
            Realizar un reclamo
          </Button>
          <Button
            onClick={() => handleOptionClick('suggestion')}
            fullWidth
            className={classes.subButton}
            variant="light"
          >
            Realizar una sugerencia
          </Button>
          <Button
            onClick={handleWhatsappClick}
            fullWidth
            className={`${classes.subButton} ${classes.whatsappButton}`}
          >
            <IconBrandWhatsapp size={20} style={{ marginRight: '10px' }} />
            Contacto Urgente por WhatsApp
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default SupportButton;