import { useState } from 'react';
import { Container, Paper } from '@mui/material';
import RoleSelect from './RoleSelect.jsx';
import CredentialsForm from './CredentialsForms.jsx';
 
export default function AuthPage({ onAuthSuccess }) {
  const [role, setRole] = useState(null);
 
  return (
    <Container sx={{ mt: 10 }}>
      {/* <Paper elevation={0} variant="outlined" > */}
        {!role ? (
          <RoleSelect onSelect={setRole} />
        ) : (
          <CredentialsForm role={role} onBack={() => setRole(null)} onAuthSuccess={onAuthSuccess} />
        )}
      {/* </Paper> */}
    </Container>
  );
}