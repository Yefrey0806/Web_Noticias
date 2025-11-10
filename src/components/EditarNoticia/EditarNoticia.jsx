import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { uploadImageToCloudinary } from "../../config/cloudinary";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const categorias = [
  "Política",
  "Economía",
  "Deportes",
  "Tecnología",
  "Salud",
  "Entretenimiento",
  "Cultura",
  "Internacional",
  "Nacional",
  "Opinión",
];

const EditarNoticia = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    categoria: "",
    imagenUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingNoticia, setLoadingNoticia] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadNoticia();
  }, [id]);

  const loadNoticia = async () => {
    try {
      const docRef = doc(db, "noticias", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const noticia = docSnap.data();

        setFormData({
          titulo: noticia.titulo || "",
          descripcion: noticia.descripcion || "",
          contenido: noticia.contenido || "",
          categoria: noticia.categoria || "",
          imagenUrl: noticia.imagenUrl || "",
        });

        if (noticia.imagenUrl) {
          setImagePreview(noticia.imagenUrl);
        }
      } else {
        setError("Noticia no encontrada");
        setTimeout(() => navigate("/editor/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Error al cargar noticia:", error);
      setError("Error al cargar la noticia");
    } finally {
      setLoadingNoticia(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (!formData.contenido.trim()) {
      setError("El contenido es obligatorio");
      return;
    }

    if (!formData.categoria) {
      setError("Selecciona una categoría");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let imagenUrl = formData.imagenUrl;

      if (imageFile) {
        imagenUrl = await uploadImageToCloudinary(imageFile);
      }

      const docRef = doc(db, "noticias", id);
      await updateDoc(docRef, {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        contenido: formData.contenido.trim(),
        categoria: formData.categoria,
        imagenUrl: imagenUrl,
        updatedAt: serverTimestamp(),
        lastEditedBy: user.email,
      });

      setSuccess("Noticia actualizada exitosamente");

      setTimeout(() => {
        navigate("/editor/gestion-noticias");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar noticia:", error);
      setError("Error al actualizar la noticia. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingNoticia) {
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/editor/gestion-noticias")}
        sx={{ mb: 2 }}
      >
        Volver a Gestión de Noticias
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Editar Noticia
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Modifica los campos que desees actualizar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Título de la Noticia"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 150 }}
            helperText={`${formData.titulo.length}/150 caracteres`}
          />

          <TextField
            fullWidth
            label="Descripción Breve"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={2}
            inputProps={{ maxLength: 300 }}
            helperText={`${formData.descripcion.length}/300 caracteres`}
          />

          <TextField
            fullWidth
            select
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            margin="normal"
            required
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Contenido Completo"
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={10}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Imagen Principal
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              {imageFile ? "Cambiar Imagen" : "Seleccionar Imagen"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imagePreview && (
              <Card sx={{ maxWidth: "100%", mb: 2 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={imagePreview}
                  alt="Preview"
                  sx={{ objectFit: "cover" }}
                />
              </Card>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? "Actualizando..." : "Actualizar Noticia"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditarNoticia;
