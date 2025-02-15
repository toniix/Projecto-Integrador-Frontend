
import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { InstrumentContext } from '../../context/InstrumentContext';
import instrumentService from '../../services/instrumentService';
import { Modal, Button, Form } from 'react-bootstrap';

export const InstrumentForm = ({ isOpen, onClose }) => {
  const { addInstrument } = useContext(InstrumentContext);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(false);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [images, setImages] = useState([]);

  // Manejo cambio de imágenes
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Usar FormData para enviar imágenes
    const formData = new FormData();
    formData.append('name', name);
    formData.append('model', model);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('available', available);
    formData.append('stock', stock);
    formData.append('description', description);
    formData.append('year', year);

    // Agregar múltiples imágenes
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const newInstrument = await instrumentService.createInstrument(formData);
      addInstrument(newInstrument);
      onClose();
      setName('');
      setModel('');
      setBrand('');
      setPrice('');
      setAvailable(false);
      setStock('');
      setDescription('');
      setYear('');
      setImages([]);
    } catch (error) {
      console.error('Error al crear el instrumento:', error);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Instrumento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formModel" className="mb-3">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Modelo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBrand" className="mb-3">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              type="text"
              placeholder="Marca"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPrice" className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAvailable" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Disponible"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
          </Form.Group>

          <Form.Group controlId="formStock" className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formYear" className="mb-3">
            <Form.Label>Año</Form.Label>
            <Form.Control
              type="number"
              placeholder="Año"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formImages" className="mb-3">
            <Form.Label>Imágenes</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
            />
          </Form.Group>

          <Button variant="primary" type="submit">
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
