import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { InstrumentContext } from '../../context/InstrumentContext';
import instrumentService from '../../services/instrumentService';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/Modal.css'

export const InstrumentForm = ({ isOpen, onClose }) => {
  const { addInstrument } = useContext(InstrumentContext);

  // Estados para el formulario
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [idType, setIdType] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(false);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [anio, setAnio] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // Cargar categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await instrumentService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  // Manejo cambio de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);  // Acumula las imágenes seleccionadas
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('instrumentoDtoJson', JSON.stringify({ 
      name, model, brand, id_tipo: idType, price: Number (price), available, stock: Number(stock), description, anio: Number (anio) 
    }));

    images.forEach((image) => {
      formData.append('file', image);
    });

    try {
      const newInstrument = await instrumentService.createInstrument(formData);
      addInstrument(newInstrument);
      onClose();
      setName('');
      setModel('');
      setBrand('');
      setIdType('');
      setPrice('');
      setAvailable(false);
      setStock('');
      setDescription('');
      setAnio('');
      setImages([]); 
    } catch (error) {
      console.error('Error al crear el instrumento:', error);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} className='modal-overlay'>
      <Modal.Header closeButton className='modal-header'>
        <Modal.Title>Registrar Instrumento</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <Form onSubmit={handleSubmit} className='form'>
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label className='form-label'>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId="formModelo" className="mb-3">
            <Form.Label className="form-label">Modelo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Modelo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId="formMarca" className="mb-3">
            <Form.Label className="form-label">Marca</Form.Label>
            <Form.Control
              type="text"
              placeholder="Marca"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId="formTipo" className="mb-3">
            <Form.Label className="form-label">Categoría</Form.Label>
            <Form.Control
              as="select"
              value={idType}
              onChange={(e) => setIdType(e.target.value)} 
              required
              className='form-control'
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((category) => (
                <option key={category.id_tipo} value={category.id_tipo}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formAnio" className="mb-3">
            <Form.Label className="form-label">Año</Form.Label>
            <Form.Control
              type="number"
              placeholder="Año"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              class name="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formPrecio" className="mb-3">
            <Form.Label className="form-label">Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId="formStock" className="mb-3">
            <Form.Label className="form-label">Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId="formDescripcion" className="mb-3">
            <Form.Label className="form-label">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId="formDisponible" className="mb-3 custom-checkbox">
            <Form.Check
              type="checkbox" 
              label="Disponible"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
          
            />
          </Form.Group>

          <Form.Group controlId="formImages" className="mb-3">
            <Form.Label className="form-label">Imágenes</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className='form-control'
            />
          </Form.Group>

          <Button className="custom-button" type="submit">
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
