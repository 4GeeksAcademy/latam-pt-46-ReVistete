// src/front/pages/SellerDashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const SellerDashboard = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar autenticación
    useEffect(() => {
        if (!store.auth?.isAuthenticated || store.auth?.user?.role !== "seller") {
            navigate("/login");
        } else {
            // Cargar productos del vendedor
            loadSellerProducts();
        }
    }, [store.auth, navigate]);

    const loadSellerProducts = async () => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/seller/products`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${store.auth?.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error al cargar los productos");
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container my-5 pt-5">
            <div className="row">
                {/* Sidebar */}
                <div className="col-lg-3 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="text-center mb-3">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto" style={{ width: "80px", height: "80px" }}>
                                    <i className="fas fa-user-circle fa-3x"></i>
                                </div>
                                <h5 className="mt-3 mb-0">{store.auth?.user?.first_name} {store.auth?.user?.last_name}</h5>
                                <small className="text-muted">@{store.auth?.user?.username}</small>
                            </div>

                            <hr />

                            <ul className="nav nav-pills flex-column">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-start w-100 ${activeTab === "overview" ? "active" : ""}`}
                                        onClick={() => setActiveTab("overview")}
                                    >
                                        <i className="fas fa-home me-2"></i> Panel Principal
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-start w-100 ${activeTab === "products" ? "active" : ""}`}
                                        onClick={() => setActiveTab("products")}
                                    >
                                        <i className="fas fa-tshirt me-2"></i> Mis Productos
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-start w-100 ${activeTab === "add-product" ? "active" : ""}`}
                                        onClick={() => setActiveTab("add-product")}
                                    >
                                        <i className="fas fa-plus-circle me-2"></i> Añadir Producto
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-start w-100 ${activeTab === "sales" ? "active" : ""}`}
                                        onClick={() => setActiveTab("sales")}
                                    >
                                        <i className="fas fa-chart-line me-2"></i> Ventas
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-start w-100 ${activeTab === "settings" ? "active" : ""}`}
                                        onClick={() => setActiveTab("settings")}
                                    >
                                        <i className="fas fa-cog me-2"></i> Configuración
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-lg-9">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Panel Principal</h2>

                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="card bg-primary text-white">
                                            <div className="card-body d-flex align-items-center">
                                                <i className="fas fa-tshirt fa-3x me-3"></i>
                                                <div>
                                                    <h6 className="card-subtitle mb-1">Productos</h6>
                                                    <h4 className="card-title mb-0">{products.length}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card bg-success text-white">
                                            <div className="card-body d-flex align-items-center">
                                                <i className="fas fa-shopping-cart fa-3x me-3"></i>
                                                <div>
                                                    <h6 className="card-subtitle mb-1">Ventas</h6>
                                                    <h4 className="card-title mb-0">0</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card bg-info text-white">
                                            <div className="card-body d-flex align-items-center">
                                                <i className="fas fa-eye fa-3x me-3"></i>
                                                <div>
                                                    <h6 className="card-subtitle mb-1">Visitas</h6>
                                                    <h4 className="card-title mb-0">0</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mt-4">
                                    <div className="card-body">
                                        <h5 className="card-title">Acciones Rápidas</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setActiveTab("add-product")}
                                            >
                                                <i className="fas fa-plus-circle me-2"></i> Añadir Producto
                                            </button>
                                            <button className="btn btn-outline-secondary">
                                                <i className="fas fa-cog me-2"></i> Configurar Tienda
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && (
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="card-title mb-0">Mis Productos</h2>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setActiveTab("add-product")}
                                    >
                                        <i className="fas fa-plus-circle me-2"></i> Añadir Producto
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="text-center my-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <p className="mt-2">Cargando tus productos...</p>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center my-5">
                                        <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                                        <h4>No tienes productos publicados</h4>
                                        <p className="text-muted">Comienza a vender añadiendo tu primer producto</p>
                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={() => setActiveTab("add-product")}
                                        >
                                            <i className="fas fa-plus-circle me-2"></i> Añadir Producto
                                        </button>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Imagen</th>
                                                    <th>Título</th>
                                                    <th>Precio</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map(product => (
                                                    <tr key={product.id}>
                                                        <td>
                                                            <img
                                                                src={product.images[0] || 'https://via.placeholder.com/50'}
                                                                alt={product.title}
                                                                className="img-thumbnail"
                                                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                            />
                                                        </td>
                                                        <td>{product.title}</td>
                                                        <td>${product.price.toFixed(2)}</td>
                                                        <td>
                                                            <span className="badge bg-success">Activo</span>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary me-1">
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger">
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add Product Tab */}
                    {activeTab === "add-product" && (
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Añadir Nuevo Producto</h2>

                                <AddProductForm />
                            </div>
                        </div>
                    )}

                    {/* Sales Tab */}
                    {activeTab === "sales" && (
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Mis Ventas</h2>

                                <div className="text-center my-5">
                                    <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                                    <h4>No tienes ventas todavía</h4>
                                    <p className="text-muted">Tus ventas aparecerán aquí una vez que los compradores adquieran tus productos</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Configuración de la Cuenta</h2>

                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="storeName" className="form-label">Nombre de la Tienda</label>
                                        <input type="text" className="form-control" id="storeName" placeholder="Ingresa el nombre de tu tienda" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="storeDescription" className="form-label">Descripción</label>
                                        <textarea className="form-control" id="storeDescription" rows="3" placeholder="Describe tu tienda en pocas palabras"></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente para el formulario de añadir producto
const AddProductForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        subcategory: "",
        size: "",
        brand: "",
        condition: "two_wears", // Valor predeterminado para "dos posturas"
        material: "",
        color: "",
        price: "",
        discount: "",
        images: []
    });

    const [errors, setErrors] = useState({});
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { store } = useGlobalReducer();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Limpiar error específico
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + uploadedImages.length > 8) {
            setErrors({ ...errors, images: "Puedes subir un máximo de 8 imágenes" });
            return;
        }

        // Preview de imágenes
        const newUploadedImages = [...uploadedImages];

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = (event) => {
                newUploadedImages.push({
                    file: file,
                    preview: event.target.result
                });

                setUploadedImages([...newUploadedImages]);
            };

            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);

        // Limpiar error de imágenes si existe
        if (errors.images) {
            setErrors({ ...errors, images: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "El título es obligatorio";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La descripción es obligatoria";
        }

        if (!formData.category) {
            newErrors.category = "La categoría es obligatoria";
        }

        if (!formData.size) {
            newErrors.size = "La talla es obligatoria";
        }

        if (!formData.price) {
            newErrors.price = "El precio es obligatorio";
        } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = "El precio debe ser un número positivo";
        }

        if (uploadedImages.length === 0) {
            newErrors.images = "Debes subir al menos una imagen";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Aquí normalmente enviarías las imágenes a un servidor como Cloudinary
            // y luego enviarías los datos del producto con las URLs de las imágenes

            // Por ahora, simulamos un éxito después de 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Éxito simulado
            alert("Producto añadido exitosamente");

            // Limpiar formulario
            setFormData({
                title: "",
                description: "",
                category: "",
                subcategory: "",
                size: "",
                brand: "",
                condition: "two_wears",
                material: "",
                color: "",
                price: "",
                discount: "",
                images: []
            });

            setUploadedImages([]);

        } catch (error) {
            setErrors({
                general: error.message || "Ocurrió un error al añadir el producto"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
            )}

            <div className="mb-3">
                <label htmlFor="title" className="form-label">Título del producto *</label>
                <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Vestido floral Zara, usado solo dos veces"
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Descripción *</label>
                <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe tu prenda: estado, razón de venta, detalles, etc."
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label">Categoría *</label>
                    <select
                        className={`form-select ${errors.category ? "is-invalid" : ""}`}
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="women">Mujer</option>
                        <option value="men">Hombre</option>
                        <option value="kids">Niños</option>
                        <option value="accessories">Accesorios</option>
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="subcategory" className="form-label">Subcategoría</label>
                    <select
                        className="form-select"
                        id="subcategory"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        disabled={!formData.category}
                    >
                        <option value="">Seleccionar...</option>
                        {formData.category === "women" && (
                            <>
                                <option value="dresses">Vestidos</option>
                                <option value="tops">Blusas</option>
                                <option value="pants">Pantalones</option>
                                <option value="skirts">Faldas</option>
                                <option value="jackets">Chaquetas</option>
                            </>
                        )}
                        {formData.category === "men" && (
                            <>
                                <option value="shirts">Camisas</option>
                                <option value="pants">Pantalones</option>
                                <option value="jackets">Chaquetas</option>
                                <option value="tshirts">Camisetas</option>
                            </>
                        )}
                        {formData.category === "kids" && (
                            <>
                                <option value="baby">Bebé</option>
                                <option value="toddler">Niño pequeño</option>
                                <option value="child">Niño</option>
                                <option value="teen">Adolescente</option>
                            </>
                        )}
                        {formData.category === "accessories" && (
                            <>
                                <option value="bags">Bolsos</option>
                                <option value="jewelry">Joyería</option>
                                <option value="hats">Sombreros</option>
                                <option value="belts">Cinturones</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="size" className="form-label">Talla *</label>
                    <select
                        className={`form-select ${errors.size ? "is-invalid" : ""}`}
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="custom">Otra (especificar en descripción)</option>
                    </select>
                    {errors.size && <div className="invalid-feedback">{errors.size}</div>}
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="brand" className="form-label">Marca</label>
                    <input
                        type="text"
                        className="form-control"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Ej: Zara, H&M, Nike..."
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="condition" className="form-label">Estado *</label>
                    <select
                        className="form-select"
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                    >
                        <option value="new_with_tags">Nuevo con etiquetas</option>
                        <option value="new_without_tags">Nuevo sin etiquetas</option>
                        <option value="two_wears">Dos posturas</option>
                        <option value="very_good">Muy buen estado</option>
                        <option value="good">Buen estado</option>
                        <option value="acceptable">Aceptable</option>
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="color" className="form-label">Color</label>
                    <input
                        type="text"
                        className="form-control"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="Ej: Negro, Rojo, Azul marino..."
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label">Precio (MXN) *</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className={`form-control ${errors.price ? "is-invalid" : ""}`}
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="discount" className="form-label">Descuento (%)</label>
                    <div className="input-group">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-control"
                            id="discount"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="0"
                        />
                        <span className="input-group-text">%</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label className="form-label">Imágenes del producto *</label>
                <div className={`dropzone p-4 text-center border rounded ${errors.images ? "border-danger" : "border-dashed"}`}>
                    <input
                        type="file"
                        id="productImages"
                        accept="image/*"
                        multiple
                        className="d-none"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="productImages" className="mb-0 cursor-pointer">
                        <div className="py-4">
                            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                            <p className="mb-0">Arrastra tus imágenes aquí o haz clic para seleccionarlas</p>
                            <small className="text-muted d-block mt-1">PNG, JPG, JPEG (máx. 8 imágenes)</small>
                            {uploadedImages.length > 0 && (
                                <span className="badge bg-primary mt-2">{uploadedImages.length} imagen(es) seleccionada(s)</span>
                            )}
                        </div>
                    </label>
                </div>
                {errors.images && <div className="text-danger small mt-1">{errors.images}</div>}

                {uploadedImages.length > 0 && (
                    <div className="mt-3">
                        <div className="d-flex flex-wrap gap-2">
                            {uploadedImages.map((image, index) => (
                                <div key={index} className="position-relative">
                                    <img
                                        src={image.preview}
                                        alt={`Preview ${index}`}
                                        className="img-thumbnail"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                                        onClick={() => removeImage(index)}
                                        style={{ margin: "-10px" }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="termsCheck" required />
                        <label className="form-check-label" htmlFor="termsCheck">
                            Acepto los términos y condiciones
                        </label>
                    </div>
                    <div className="form-check mt-2">
                        <input className="form-check-input" type="checkbox" id="qualityCheck" required />
                        <label className="form-check-label" htmlFor="qualityCheck">
                            Confirmo que la información y las imágenes son verídicas
                        </label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card bg-light">
                        <div className="card-body py-2">
                            <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Tu producto será revisado antes de ser publicado para garantizar la calidad de nuestra plataforma.
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary">Guardar borrador</button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Publicando...
                        </>
                    ) : (
                        "Publicar producto"
                    )}
                </button>
            </div>
        </form>
    );
};

export default SellerDashboard;