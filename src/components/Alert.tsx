import React from 'react';
import Alert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AlertProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({
  open = false,
  message,
  severity = 'info',
  onClose,
}) => {
  const [toggle, setToggle] = React.useState(open);

  return (
    <Alert
      onClose={onClose}
      severity={severity}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setToggle(toggle);
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {message}
    </Alert>
  );
};

export default CustomAlert;
