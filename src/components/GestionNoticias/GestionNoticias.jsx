import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";

const GestionNoticias = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    noticia: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNoticia, setSelectedNoticia] = useState(null);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const noticiasRef = collection(db, "noticias");
      const q = query(noticiasRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const noticiasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNoticias(noticiasData);
    } catch (error) {
      console.error("Error al obtener noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, noticia) => {
    setAnchorEl(event.currentTarget);
    setSelectedNoticia(noticia);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNoticia(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePublicar = async (noticiaId) => {
    try {
      setActionLoading(true);
      const docRef = doc(db, "noticias", noticiaId);
      await updateDoc(docRef, {
        estado: "publicada",
        publishedAt: new Date(),
      });

      setSuccessMessage("Noticia publicada exitosamente");
      fetchNoticias();
      handleMenuClose();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al publicar noticia:", error);
      alert("Error al publicar la noticia");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDesactivar = async (noticiaId) => {
    try {
      setActionLoading(true);
      const docRef = doc(db, "noticias", noticiaId);
      await updateDoc(docRef, {
        estado: "desactivada",
        deactivatedAt: new Date(),
      });

      setSuccessMessage("Noticia desactivada exitosamente");
      fetchNoticias();
      handleMenuClose();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al desactivar noticia:", error);
      alert("Error al desactivar la noticia");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEliminar = async () => {
    try {
      setActionLoading(true);
      const docRef = doc(db, "noticias", deleteDialog.noticia.id);
      await deleteDoc(docRef);

      setSuccessMessage("Noticia eliminada exitosamente");
      fetchNoticias();
      setDeleteDialog({ open: false, noticia: null });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      alert("Error al eliminar la noticia");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteDialog = (noticia) => {
    setDeleteDialog({ open: true, noticia });
    handleMenuClose();
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, noticia: null });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "publicada":
        return "success";
      case "pendiente":
        return "warning";
      case "desactivada":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Fecha no disponible";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredNoticias = noticias.filter((noticia) => {
    if (tabValue === 0) return noticia.estado === "pendiente";
    if (tabValue === 1) return noticia.estado === "publicada";
    if (tabValue === 2) return noticia.estado === "desactivada";
    return true;
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/editor/dashboard")}
        sx={{ mb: 2 }}
      >
        Volver al Panel
      </Button>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Noticias
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Administra todas las noticias del sistema
          </Typography>
        </Box>

        {successMessage && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Alert severity="success">{successMessage}</Alert>
          </Box>
        )}

        {/* Tabs de filtrado */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}
        >
          <Tab
            label={`Pendientes (${
              noticias.filter((n) => n.estado === "pendiente").length
            })`}
            icon={
              <Chip
                label={noticias.filter((n) => n.estado === "pendiente").length}
                size="small"
                color="warning"
              />
            }
            iconPosition="end"
          />
          <Tab
            label={`Publicadas (${
              noticias.filter((n) => n.estado === "publicada").length
            })`}
            icon={
              <Chip
                label={noticias.filter((n) => n.estado === "publicada").length}
                size="small"
                color="success"
              />
            }
            iconPosition="end"
          />
          <Tab
            label={`Desactivadas (${
              noticias.filter((n) => n.estado === "desactivada").length
            })`}
            icon={
              <Chip
                label={
                  noticias.filter((n) => n.estado === "desactivada").length
                }
                size="small"
                color="error"
              />
            }
            iconPosition="end"
          />
        </Tabs>
      </Paper>

      {/* Grid de Noticias */}
      {filteredNoticias.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No hay noticias en esta categoría
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredNoticias.map((noticia) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={noticia.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    noticia.imagenUrl ||
                    "https://via.placeholder.com/400x200?text=Sin+Imagen"
                  }
                  alt={noticia.titulo}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        flex: 1,
                      }}
                    >
                      <Chip
                        label={noticia.estado || "pendiente"}
                        size="small"
                        color={getEstadoColor(noticia.estado)}
                      />
                      <Chip
                        label={noticia.categoria}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, noticia)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {noticia.titulo}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {noticia.descripcion}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Por: {noticia.autor}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Creada: {formatDate(noticia.createdAt)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  {noticia.estado === "pendiente" && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<PublishIcon />}
                      onClick={() => handlePublicar(noticia.id)}
                      disabled={actionLoading}
                    >
                      Publicar
                    </Button>
                  )}

                  {noticia.estado === "publicada" && (
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      fullWidth
                      startIcon={<UnpublishedIcon />}
                      onClick={() => handleDesactivar(noticia.id)}
                      disabled={actionLoading}
                    >
                      Desactivar
                    </Button>
                  )}

                  {noticia.estado === "desactivada" && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<PublishIcon />}
                      onClick={() => handlePublicar(noticia.id)}
                      disabled={actionLoading}
                    >
                      Publicar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/noticia/${selectedNoticia.id}`);
            handleMenuClose();
          }}
        >
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          Ver Noticia
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/editor/editar-noticia/${selectedNoticia.id}`);
            handleMenuClose();
          }}
        >
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        {selectedNoticia?.estado === "pendiente" && (
          <MenuItem
            onClick={() => {
              handlePublicar(selectedNoticia.id);
            }}
          >
            <PublishIcon sx={{ mr: 1 }} fontSize="small" />
            Publicar
          </MenuItem>
        )}
        {selectedNoticia?.estado === "publicada" && (
          <MenuItem
            onClick={() => {
              handleDesactivar(selectedNoticia.id);
            }}
          >
            <UnpublishedIcon sx={{ mr: 1 }} fontSize="small" />
            Desactivar
          </MenuItem>
        )}
        {selectedNoticia?.estado === "desactivada" && (
          <MenuItem
            onClick={() => {
              handlePublicar(selectedNoticia.id);
            }}
          >
            <PublishIcon sx={{ mr: 1 }} fontSize="small" />
            Re-publicar
          </MenuItem>
        )}
        <MenuItem
          onClick={() => openDeleteDialog(selectedNoticia)}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la noticia{" "}
            <strong>"{deleteDialog.noticia?.titulo}"</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleEliminar}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GestionNoticias;
