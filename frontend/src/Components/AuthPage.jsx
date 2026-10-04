import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelect from './RoleSelect.jsx';
import CredentialsForm from './CredentialsForms.jsx';
import ForgotPassword from './ForgotPassword.jsx';

export default function AuthPage({ onAuthSuccess }) {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      {!role ? (
        <RoleSelect onSelect={setRole} />
      ) : (
        <CredentialsForm
          role={role}
          onBack={() => setRole(null)}
          onAuthSuccess={onAuthSuccess}
          onForgotPassword={() => navigate('/forgot-password')}
        />
      )}
    </div>
  );
}