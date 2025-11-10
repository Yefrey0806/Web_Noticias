import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password, role);

      // Redirigir según el rol
      if (role === "editor") {
        navigate("/editor/dashboard");
      } else {
        navigate("/reportero/dashboard");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado");
      } else if (error.code === "auth/invalid-email") {
        setError("Correo electrónico inválido");
      } else {
        setError("Error al crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={5} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <PersonAddIcon
              sx={{ fontSize: 40, color: "primary.main", mr: 1 }}
            />
            <Typography component="h1" variant="h4" fontWeight="bold">
              Crear Cuenta
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              select
              id="role"
              name="role"
              label="Tipo de Cuenta" //Si da error, quitar
              value={role}
              onChange={(e) => setRole(e.target.value)}
              helperText="Selecciona el tipo de cuenta que deseas crear"
            >
              <MenuItem value="reportero">Reportero</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                href="/login"
                variant="body2"
                sx={{ textDecoration: "none" }}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
