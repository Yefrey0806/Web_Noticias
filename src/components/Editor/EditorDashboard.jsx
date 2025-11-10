import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
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
import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArticleIcon from "@mui/icons-material/Article";

const EditorDashboard = () => {
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
      const querySnapshot = await getDocs(noticiasRef);

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
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        p: 3,
        borderRadius: 2,
      }}
    >
      <Paper elevation={5} sx={{ p: 4 }}>
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
            <DashboardIcon
              sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
            />
            <Typography variant="h4" fontWeight="bold">
              Panel Editor
            </Typography>
          </Box>
          {/*<Chip label="Rol: Editor" color="success" />*/}
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Bienvenido: <strong>{user?.email}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Como editor, tienes control total sobre todas las noticias. Puedes
          aprobar, publicar, desactivar, editar y eliminar cualquier noticia del
          sistema, puedes revisar los estados de las noticias en el apartado de
          Noticias.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Estadísticas editor */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Estadísticas del Sistema
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                textAlign: "center",
                backgroundColor: "#e3f2fd",
                cursor: "pointer",
              }}
            >
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
            <Card
              sx={{
                textAlign: "center",
                backgroundColor: "#fff3e0",
                cursor: "pointer",
              }}
            >
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
            <Card
              sx={{
                textAlign: "center",
                backgroundColor: "#e8f5e9",
                cursor: "pointer",
              }}
            >
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
            <Card
              sx={{
                textAlign: "center",
                backgroundColor: "#ffebee",
                cursor: "pointer",
              }}
            >
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

        {/* Acciones editor */}
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
              onClick={() => navigate("/editor/gestion-noticias")}
            >
              <PendingActionsIcon
                sx={{ fontSize: 50, color: "warning.main", mb: 1 }}
              />
              <Typography variant="h6" fontWeight="bold">
                Noticias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revisar, publicar, desactivar, eliminar
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/*Secciones noticias*/}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              maxWidth: "30rem",
            }}
            onClick={() => navigate("/editor/secciones")}
          >
            <DashboardIcon
              sx={{ fontSize: 50, color: "primary.main", mb: 1 }}
            />
            <Typography variant="h6" fontWeight="bold">
              Secciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrar categorías para las noticias
            </Typography>
          </Paper>
        </Grid>

        <Divider sx={{ mb: 3, marginTop: "1.5rem" }} />

        <Box sx={{ p: 2, backgroundColor: "#e8f5e9", borderRadius: 2, mb: 3 }}>
          <Typography variant="body2" color="success.dark">
            <strong>Flujo de trabajo:</strong> Los reporteros crean noticias que
            quedan "Pendientes". Tú revisas, apruebas y publicas las noticias de
            calidad.
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

export default EditorDashboard;
