import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    // Estados para manejar el producto y la carga
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    // Estados para las funcionalidades
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerAmount, setOfferAmount] = useState('');
    const [offerMessage, setOfferMessage] = useState('');
    const [question, setQuestion] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Cargar los detalles del producto cada vez que cambie el id
    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/details`);

            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            } else {
                console.error('Error al cargar el producto, status:', response.status);
                navigate('/catalog');
            }
        } catch (error) {
            console.error('Error en fetchProductDetails:', error);
            navigate('/catalog');
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar al carrito
    const handleAddToCart = () => {
        if (!product) return;

        const item = {
            ...product,
            quantity,
            sellerPhone: product.seller.phone
        };

        dispatch({
            type: 'add_to_cart',
            payload: item
        });

        alert('Producto agregado al carrito');
    };

    // Función para iniciar el modal de oferta
    const handleMakeOffer = () => {
        if (!store.auth?.isAuthenticated) {
            navigate('/login');
            return;
        }
        if (store.auth?.user?.role !== 'buyer') {
            alert('Solo los compradores pueden hacer ofertas');
            return;
        }
        setShowOfferModal(true);
    };

    // Enviar la oferta al backend
    const handleSubmitOffer = async () => {

        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            alert('Por favor ingresa un monto válido');
            return;
        }
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/offers`;
            console.log("URL:", url);

            const requestBody = {
                amount: parseFloat(offerAmount),
                message: offerMessage
            };
            console.log("Request body:", requestBody);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.auth?.token}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                alert('¡Oferta enviada exitosamente! El vendedor será notificado.');
                setShowOfferModal(false);
                setOfferAmount('');
                setOfferMessage('');
            } else {
                if (data.warning) {
                    const confirmAction = window.confirm(
                        `${data.warning}\n\nSe sugiere ofrecer al menos ${data.suggested_min.toFixed(2)}\n\n¿Deseas continuar con tu oferta?`
                    );
                    if (!confirmAction) return;
                } else {
                    alert(data.error || 'Error al enviar la oferta');
                }
            }
        } catch (error) {
            console.error('Error completo:', error);
            alert('Error de conexión al enviar la oferta');
        }
    };

    // Enviar pregunta (solo simulación por ahora)
    const handleAskQuestion = () => {
        if (!store.auth?.isAuthenticated) {
            navigate('/login');
            return;
        }
        if (question.trim()) {
            alert(`Pregunta enviada: ${question}`);
            setQuestion('');
            // Aquí iría la lógica real para enviar la pregunta al backend
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mt-5 pt-5">
                <div className="alert alert-danger">Producto no encontrado</div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
                    <li className="breadcrumb-item"><Link to="/catalog">Catálogo</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
                </ol>
            </nav>

            <div className="row">
                {/* Columna de imágenes */}
                <div className="col-lg-6 mb-4">
                    <div className="card border-0">
                        {/* Imagen principal */}
                        <div className="main-image-container mb-3" style={{ height: '500px', overflow: 'hidden' }}>
                            <img
                                src={
                                    product.images && product.images[selectedImage]
                                        ? product.images[selectedImage].url
                                        : 'https://via.placeholder.com/500'
                                }
                                alt={product.title}
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                            />
                        </div>

                        {/* Miniaturas */}
                        {product.images && product.images.length > 1 && (
                            <div className="d-flex gap-2 justify-content-center">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded ${selectedImage === index ? 'border-primary border-2' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            cursor: 'pointer',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.title} ${index + 1}`}
                                            className="img-fluid w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna de información */}
                <div className="col-lg-6">
                    <div className="card border-0">
                        <div className="card-body">
                            {/* Título y precio */}
                            <h1 className="h3 mb-3">{product.title}</h1>
                            <div className="d-flex align-items-baseline mb-4">
                                {product.discount > 0 ? (
                                    <>
                                        <h2 className="text-danger mb-0">
                                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                        </h2>
                                        <span className="text-muted text-decoration-line-through ms-3">
                                            ${product.price}
                                        </span>
                                        <span className="badge bg-danger ms-2">-{product.discount}%</span>
                                    </>
                                ) : (
                                    <h2 className="mb-0">${product.price}</h2>
                                )}
                            </div>

                            {/* Botones principales */}
                            <div className="d-grid gap-2 mb-4">
                                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                    Agregar al carrito
                                </button>
                                <button className="btn btn-outline-primary btn-lg" onClick={handleMakeOffer}>
                                    Hacer oferta
                                </button>
                            </div>

                            {/* Descripción */}
                            <div className="mb-4">
                                <h5 className="mb-3">Descripción y detalles</h5>
                                <p className="text-muted">{product.description}</p>
                            </div>

                            {/* Características */}
                            <div className="mb-4">
                                <h5 className="mb-3">Características</h5>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">Categoría:</td>
                                            <td>{getCategoryName(product.category)}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Talla:</td>
                                            <td>{product.size}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Estado:</td>
                                            <td>{getConditionName(product.condition)}</td>
                                        </tr>
                                        {product.brand && (
                                            <tr>
                                                <td className="text-muted">Marca:</td>
                                                <td>{product.brand}</td>
                                            </tr>
                                        )}
                                        {product.color && (
                                            <tr>
                                                <td className="text-muted">Color:</td>
                                                <td>{product.color}</td>
                                            </tr>
                                        )}
                                        {product.material && (
                                            <tr>
                                                <td className="text-muted">Material:</td>
                                                <td>{product.material}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Información del vendedor (sin botón de contactar) */}
                            <div className="card bg-light mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Vendedor</h5>
                                    <div className="d-flex align-items-center mb-3">
                                        <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                            style={{ width: '50px', height: '50px' }}
                                        >
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0">{product.seller.first_name}</h6>
                                            <small className="text-muted">@{product.seller.username}</small>
                                            <div className="small text-muted">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {product.seller.city}
                                            </div>
                                        </div>
                                    </div>
                                    {/* El botón "Contactar vendedor" ha sido ocultado */}
                                </div>
                            </div>

                            {/* Sección de preguntas */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Pregunta al vendedor</h5>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Escribe tu pregunta aquí..."
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={handleAskQuestion}
                                        >
                                            Preguntar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Otros productos del vendedor */}
            {product.seller_other_products && product.seller_other_products.length > 0 && (
                <div className="mt-5">
                    <h4 className="mb-4">Otros productos de {product.seller.first_name}</h4>
                    <div className="row g-3">
                        {product.seller_other_products.map(item => (
                            <div key={item.id} className="col-6 col-md-3">
                                <Link to={`/product/${item.id}`} className="text-decoration-none">
                                    <div className="card h-100 product-card">
                                        <img
                                            src={
                                                item.images && item.images[0]
                                                    ? item.images[0].url
                                                    : 'https://via.placeholder.com/200'
                                            }
                                            className="card-img-top"
                                            alt={item.title}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <h6 className="card-title text-truncate">{item.title}</h6>
                                            <p className="card-text mb-0 fw-bold">${item.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Productos similares */}
            {product.similar_products && product.similar_products.length > 0 && (
                <div className="mt-5 mb-5">
                    <h4 className="mb-4">Productos similares</h4>
                    <div className="row g-3">
                        {product.similar_products.map(item => (
                            <div key={item.id} className="col-6 col-md-3">
                                <Link to={`/product/${item.id}`} className="text-decoration-none">
                                    <div className="card h-100 product-card">
                                        <img
                                            src={
                                                item.images && item.images[0]
                                                    ? item.images[0].url
                                                    : 'https://via.placeholder.com/200'
                                            }
                                            className="card-img-top"
                                            alt={item.title}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <h6 className="card-title text-truncate">{item.title}</h6>
                                            <p className="card-text mb-0 fw-bold">${item.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal para hacer oferta */}
            {showOfferModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Hacer una oferta</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowOfferModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted">Precio actual: ${product.price}</p>

                                {/* Campo para el monto */}
                                <div className="mb-3">
                                    <label className="form-label">Tu oferta *</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="0.00"
                                            value={offerAmount}
                                            onChange={(e) => setOfferAmount(e.target.value)}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <small className="text-muted">
                                        Sugerencia: Ofrece al menos el 70% del precio (${(product.price * 0.7).toFixed(2)})
                                    </small>
                                </div>

                                {/* Campo para el mensaje */}
                                <div className="mb-3">
                                    <label className="form-label">Mensaje al vendedor (opcional)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Hola, me interesa tu producto..."
                                        value={offerMessage}
                                        onChange={(e) => setOfferMessage(e.target.value)}
                                        maxLength="200"
                                    />
                                    <small className="text-muted">{offerMessage.length}/200 caracteres</small>
                                </div>

                                <div className="alert alert-info small">
                                    <i className="fas fa-info-circle me-2"></i>
                                    El vendedor recibirá tu oferta y podrá aceptarla o rechazarla.
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowOfferModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmitOffer}
                                    disabled={!offerAmount || parseFloat(offerAmount) <= 0}
                                >
                                    Enviar oferta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Funciones auxiliares para nombres amigables
const getCategoryName = (category) => {
    const categoryMap = {
        'mujer_vestidos': 'Vestidos',
        'mujer_blusas': 'Blusas',
        'mujer_pantalones': 'Pantalones',
        'mujer_faldas': 'Faldas',
        'mujer_abrigos': 'Abrigos',
        'mujer_zapatos': 'Zapatos',
        'mujer_deportivo': 'Ropa Deportiva Mujer',
        'hombre_camisetas': 'Camisetas',
        'hombre_camisas': 'Camisas',
        'hombre_pantalones': 'Pantalones',
        'hombre_abrigos': 'Abrigos',
        'hombre_zapatos': 'Zapatos',
        'hombre_deportivo': 'Ropa Deportiva Hombre',
        'unisex_accesorios': 'Accesorios',
        'unisex_bolsos': 'Bolsos',
        'unisex_gorras': 'Gorras'
    };
    return categoryMap[category] || category;
};

const getConditionName = (condition) => {
    const conditionMap = {
        'new_with_tags': 'Nuevo con etiquetas',
        'new_without_tags': 'Nuevo sin etiquetas',
        'two_wears': 'Dos usos',
        'very_good': 'Muy buen estado',
        'good': 'Buen estado',
        'acceptable': 'Aceptable'
    };
    return conditionMap[condition] || condition;
};

export default ProductDetail;
