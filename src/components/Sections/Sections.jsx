import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Sections = () => {
  const [secciones, setSecciones] = useState([]);
  const [nuevaSeccion, setNuevaSeccion] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorEditar, setValorEditar] = useState("");
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    const cargar = async () => {
      const snap = await getDocs(collection(db, "secciones"));
      setSecciones(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    cargar();
  }, []);

  const agregar = async () => {
    if (!nuevaSeccion.trim()) return;
    await addDoc(collection(db, "secciones"), { nombre: nuevaSeccion });
    window.location.reload();
  };

  const eliminar = async (id) => {
    await deleteDoc(doc(db, "secciones", id));
    window.location.reload();
  };

  const guardarEdicion = async (id) => {
    await updateDoc(doc(db, "secciones", id), { nombre: valorEditar });
    setEditando(null);
    window.location.reload();
  };

  {
    /*}

  if (
    user?.email !== "editor@correo.com" &&
    user?.email !== "admin@correo.com"
  ) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          No tienes permiso para administrar secciones
        </Typography>
      </Container>
    );
  }
*/
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="text"
        sx={{ mb: 2 }}
        onClick={() => navigate("/editor/dashboard")}
      >
        Volver al Panel
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Gestión de Secciones
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Crea y administra las categorías del sitio
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Nueva sección"
            value={nuevaSeccion}
            onChange={(e) => setNuevaSeccion(e.target.value)}
            fullWidth
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={agregar}>
            Agregar
          </Button>
        </Box>

        {secciones.map((sec) => (
          <Box
            key={sec.id}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3,
              boxShadow: 4,
              border: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fafafa",
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: 8,
                transform: "scale(1.02)",
              },
            }}
          >
            <Box>
              {editando === sec.id ? (
                <TextField
                  value={valorEditar}
                  onChange={(e) => setValorEditar(e.target.value)}
                  size="small"
                />
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold">
                    {sec.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sección para clasificar noticias
                  </Typography>
                </>
              )}
            </Box>

            <Box>
              {editando === sec.id ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{ mr: 2 }}
                    onClick={() => guardarEdicion(sec.id)}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    size="large"
                    onClick={() => setEditando(null)}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => {
                      setEditando(sec.id);
                      setValorEditar(sec.nombre);
                    }}
                  >
                    <EditIcon color="warning" />
                  </IconButton>

                  <IconButton onClick={() => eliminar(sec.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default Sections;
