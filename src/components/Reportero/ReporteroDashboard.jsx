import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const ReporteroDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    publicadas: 0,
    desactivadas: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const noticiasRef = collection(db, "noticias");
      const q = query(noticiasRef, where("autorId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      let pendientes = 0;
      let publicadas = 0;
      let desactivadas = 0;

      querySnapshot.forEach((doc) => {
        const estado = doc.data().estado;
        if (estado === "pendiente") pendientes++;
        else if (estado === "publicada") publicadas++;
        else if (estado === "desactivada") desactivadas++;
      });

      setStats({
        total: querySnapshot.size,
        pendientes,
        publicadas,
        desactivadas,
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ArticleIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              Panel Reportero
            </Typography>
          </Box>
          {/*<Chip label="Rol: Reportero" color="info" />*/}
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Bienvenido: <strong>{user?.email}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Como reportero, puedes crear y editar noticias. Las noticias quedarán
          en estado <strong>"Pendiente"</strong> hasta que un Editor las apruebe
          y publique, puedes revisar el estado de tus noticias en el apartado
          Mis Noticias.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Estadísticas */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Mis Estadísticas
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <ArticleIcon
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Noticias
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ textAlign: "center", backgroundColor: "#fff3e0" }}>
              <CardContent>
                <PendingActionsIcon
                  sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
                />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.pendientes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ textAlign: "center", backgroundColor: "#e8f5e9" }}>
              <CardContent>
                <CheckCircleIcon
                  sx={{ fontSize: 40, color: "success.main", mb: 1 }}
                />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.publicadas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publicadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ textAlign: "center", backgroundColor: "#ffebee" }}>
              <CardContent>
                <UnpublishedIcon
                  sx={{ fontSize: 40, color: "error.main", mb: 1 }}
                />
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats.desactivadas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desactivadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Acciones reportero */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Acciones
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              }}
              onClick={() => navigate("/reportero/crear-noticia")}
            >
              <AddIcon sx={{ fontSize: 50, color: "success.main", mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Crear Noticia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redacta nuevas noticias
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              }}
              onClick={() => navigate("/reportero/list-noticias")}
            >
              <EditIcon sx={{ fontSize: 50, color: "warning.main", mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Mis Noticias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver y editar ({stats.total})
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: 2, mb: 3 }}>
          <Typography variant="body2" color="primary.dark">
            <strong>Nota:</strong> Todas las noticias que crees estarán en
            estado "Pendiente" hasta que un Editor las revise y publique.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Cerrar Sesión
        </Button>
      </Paper>
    </Container>
  );
};

export default ReporteroDashboard;
