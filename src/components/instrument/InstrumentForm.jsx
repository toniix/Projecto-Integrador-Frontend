import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { InstrumentContext } from '../../context/InstrumentContext';
import instrumentService from '../../services/instrumentService';
import cloudinaryService from '../../services/images/cloudinaryService';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/Modal.css';

export const InstrumentForm = ({ isOpen, onClose }) => {
  const { addInstrument } = useContext(InstrumentContext);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    stock: '',
    description: '',
    price: '',
    available: false,
    idCategory: '',
    imageUrls: [] // Guardará las URLs de las imágenes subidas
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await instrumentService.getCategories();
  
        // Acceder correctamente al array dentro del objeto response
        if (data?.response?.categories && Array.isArray(data.response.categories)) {
          setCategories(data.response.categories);
        } else {
          console.error("La API no devolvió un array:", data);
          setCategories([]); // Evita que el valor sea null o undefined
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setError('Error al cargar categorías');
        setCategories([]); // Asegura que `categories` siempre sea un array
      }
    };
  
    fetchCategories();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'idCategory' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const urls = await Promise.all(
        Array.from(files).map(file => cloudinaryService.uploadImage(file))
      );
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls] // Agrega las nuevas imágenes
      }));
    } catch {
      setError('Error al subir imágenes');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: '',
      stock: '',
      description: '',
      price: '',
      available: false,
      idCategory: '',
      imageUrls: []
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Asegurar que se envíe un ID válido
      if (!formData.idCategory) {
        setError('Debes seleccionar una categoría.');
        return;
      }
  
      const newInstrument = await instrumentService.createInstrument(formData);
      addInstrument(newInstrument);
      resetForm();
      onClose();
    } catch (error) {
      setError(error.message || 'Error al crear el instrumento');
    }
  };
  
  

  return (
    <Modal show={isOpen} onHide={onClose} className="modal-overlay">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>Registrar Instrumento</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit} className="form">
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label className='form-label'>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formMarca" className="mb-3">
            <Form.Label className="form-label" >Marca</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formModelo" className="mb-3">
            <Form.Label className='form-label'>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formYear" className="mb-3">
            <Form.Label className="form-label">Año</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formNStock" className="mb-3">
            <Form.Label className="form-label">Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formTipo" className="mb-3">
            <Form.Label className="form-label">Categoría</Form.Label>
            <Form.Select
              name="idCategory"
              value={formData.idCategory}
              onChange={handleInputChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar Categoría</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category, index) => (
                  <option key={category.idCategory || index} value={category.idCategory}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>Cargando categorías...</option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formPrecio" className="mb-3">
            <Form.Label className="form-label">Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formDescripcion" className="mb-3">
            <Form.Label className="form-label">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId='formDisponible' className="mb-3 custom-checkbox">
            <Form.Check
              type="checkbox"
              label="Disponible"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formImageUpload" className="mb-3">
            <Form.Label>Imágenes</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageUpload}
              //accept="image/*"
              multiple
              required
              className="form-control"
            />
          </Form.Group>
          {uploading && <p>Subiendo imágenes...</p>}
          <Form.Group controlId="formImagePreview">
            <Form.Label>Imágenes Cargadas</Form.Label>
            <div>
              {formData.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Imagen ${index + 1}`} width="100" />
              ))}
            </div>
          </Form.Group>

          <Button type="submit" className="custom-button">
            Registrar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

InstrumentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};