import React from 'react';
import Alert from '@mui/material/Alert';
import { IconButton } from '@mui/material';

interface AlertProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ open = false, message, severity = 'info' }) => {
  const [toggle, setToggle] = React.useState(open);

  return (
    <Alert
      severity={severity}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setToggle(toggle);
          }}
        ></IconButton>
      }
    >
      {message}
    </Alert>
  );
};

export default CustomAlert;
