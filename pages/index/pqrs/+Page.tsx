import React, { useState } from 'react';
import { Button, Drawer } from '@mantine/core';
import { IconHelpCircle, IconBrandWhatsapp } from '@tabler/icons-react';
import './page.module.css';

const SupportButton = () => {
  const [opened, setOpened] = useState(false);

  const toggleMenu = () => {
    setOpened(!opened);
  };

  const handleOptionClick = (option: 'petition' | 'complaint' | 'claim' | 'suggestion') => {
    const forms = {
      petition: 'https://forms.google.com/petition',
      complaint: 'https://forms.google.com/complaint',
      claim: 'https://forms.google.com/claim',
      suggestion: 'https://forms.google.com/suggestion',
    };
    window.open(forms[option], '_blank');
  };

  const handleWhatsappClick = () => {
    const message = "Hola, necesito ayuda urgente para mi proceso de Data Salud.";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Button
        onClick={toggleMenu}
        className="support-button"
        leftSection={<IconHelpCircle size={24} />}
      >
        Soporte
      </Button>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Opciones de Soporte"
        padding="xl"
        size="sm"
        position="left"
        className="support-drawer"
        transitionProps={{ transition: 'slide-right', duration: 150 }}
      >
        <div className="drawer-content">
          <Button onClick={() => handleOptionClick('petition')} fullWidth className="sub-button">
            Realizar una petición
          </Button>
          <Button onClick={() => handleOptionClick('complaint')} fullWidth className="sub-button">
            Realizar una queja
          </Button>
          <Button onClick={() => handleOptionClick('claim')} fullWidth className="sub-button">
            Realizar un reclamo
          </Button>
          <Button onClick={() => handleOptionClick('suggestion')} fullWidth className="sub-button">
            Realizar una sugerencia
          </Button>
          <Button onClick={handleWhatsappClick} fullWidth className="sub-button whatsapp-button">
            <IconBrandWhatsapp size={20} style={{ marginRight: '10px' }} />
            Contacto Urgente por WhatsApp
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default SupportButton;