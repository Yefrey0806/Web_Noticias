import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
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

const NoticiaForm = () => {
  const { id } = useParams(); // Si hay ID, es edición
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingNoticia, setLoadingNoticia] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    categoria: "",
    imagenUrl: "",
  });

  // Cargar noticia si estamos editando
  useEffect(() => {
    if (id) {
      loadNoticia();
    }
  }, [id]);

  //Cargar categorías desde Firestore
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadNoticia = async () => {
    try {
      setLoadingNoticia(true);
      const docRef = doc(db, "noticias", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const noticia = docSnap.data();

        // Verificar permisos: El reportero solo puede editar sus propias noticias
        if (userRole === "reportero" && noticia.autorId !== user.uid) {
          setError("No tienes permiso para editar esta noticia");
          setTimeout(() => navigate(`/${userRole}/dashboard`), 2000);
          return;
        }

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
        setTimeout(() => navigate(`/${userRole}/dashboard`), 2000);
      }
    } catch (error) {
      console.error("Error al cargar noticia:", error);
      setError("Error al cargar la noticia");
    } finally {
      setLoadingNoticia(false);
    }
  };

  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const querySnapshot = await getDocs(collection(db, "secciones"));

      const categoriasData = [];
      querySnapshot.forEach((doc) => {
        categoriasData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const nombresCategories = categoriasData.map((cat) => cat.nombre);

      setCategorias(nombresCategories);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setError("Error al cargar las categorías");
      // Categorias por por defecto si hay falla
      setCategorias(["Política", "Economía", "Deportes", "Cultura"]);
    } finally {
      setLoadingCategorias(false);
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

      // Validar tamaño imagen(máximo 5MB)
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

    // Validaciones de campos vacíos
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

      const noticiaData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        contenido: formData.contenido.trim(),
        categoria: formData.categoria,
        imagenUrl: imagenUrl,
        autor: user.email,
        autorId: user.uid,
        autorRole: userRole,
      };

      if (id) {
        // Actualizar noticia existente
        const docRef = doc(db, "noticias", id);
        await updateDoc(docRef, {
          ...noticiaData,
          updatedAt: serverTimestamp(),
        });
        setSuccess("Noticia actualizada exitosamente");
      } else {
        // Crear nueva noticia
        await addDoc(collection(db, "noticias"), {
          ...noticiaData,
          estado: "pendiente",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setSuccess(
          "Noticia creada exitosamente. Está pendiente de aprobación."
        );
      }

      setTimeout(() => {
        navigate(`/${userRole}/dashboard`);
      }, 2000);
    } catch (error) {
      console.error("Error al guardar noticia:", error);
      setError("Error al guardar la noticia. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingNoticia || loadingCategorias) {
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
        onClick={() => navigate(`/${userRole}/dashboard`)}
        sx={{ mb: 2 }}
      >
        Volver al Panel
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {id ? "Editar Noticia" : "Crear Nueva Noticia"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {id
            ? "Modifica los campos que desees actualizar"
            : "Completa todos los campos para crear una noticia"}
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

        {/* Campos para crear noticia */}
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
            helperText={`${formData.descripcion.length}/300 caracteres. Esta descripción aparecerá en la vista previa.`}
          />

          <TextField
            fullWidth
            select
            label="Categoría" //Quitar si da error
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loadingCategorias}
            helperText={
              loadingCategorias
                ? "Cargando categorías..."
                : "Selecciona la categoría más apropiada"
            }
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
            helperText="Escribe el contenido completo de la noticia"
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

            <Typography variant="caption" color="text.secondary">
              Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
            </Typography>
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
            {loading
              ? "Guardando..."
              : id
              ? "Actualizar Noticia"
              : "Crear Noticia"}
          </Button>

          {!id && (
            <Alert severity="info" sx={{ mt: 2 }}>
              La noticia quedará en estado <strong>"Pendiente"</strong> hasta
              que un Editor la apruebe y publique.
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NoticiaForm;
