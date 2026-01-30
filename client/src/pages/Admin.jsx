import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isAuthenticated,
  verifyToken,
  logout,
  changePassword,
  uploadImage,
  getProducts,
  createProduct,
  deleteProduct,
  getServices,
  createService,
  deleteService,
  getWorkshops,
  createWorkshop,
  deleteWorkshop,
  getProjects,
  createProject,
  deleteProject,
  getMessages,
  deleteMessage,
  addItemImage,
  deleteItemImage,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../api';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  // Form states
  const [productForm, setProductForm] = useState({ name: '', price: '', category: '', description: '', image_url: '' });
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', image_url: '' });
  const [workshopForm, setWorkshopForm] = useState({ title: '', description: '', schedule_date: '', price: '', image_url: '' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', customer_feedback: '', image_url: '' });
  const [testimonialForm, setTestimonialForm] = useState({ customer_name: '', customer_title: '', content: '', rating: 5, image_url: '', is_featured: false });
  
  // Password change
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Image management
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageModal, setImageModal] = useState({ open: false, itemType: '', itemId: null, itemName: '', images: [] });
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    try {
      await verifyToken();
      loadData();
    } catch (err) {
      navigate('/admin/login');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, servicesData, workshopsData, projectsData, messagesData, testimonialsData] = await Promise.all([
        getProducts(),
        getServices(),
        getWorkshops(),
        getProjects(),
        getMessages(),
        getTestimonials(),
      ]);
      setProducts(productsData);
      setServices(servicesData);
      setWorkshops(workshopsData);
      setProjects(projectsData);
      setMessages(messagesData);
      setTestimonials(testimonialsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleImageUpload = async (e, category, setFormFn) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    setError('');
    
    try {
      const result = await uploadImage(file, category);
      setFormFn(prev => ({ ...prev, image_url: result.imageUrl }));
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    }
  };

  // Open image gallery modal
  const openImageModal = (itemType, item) => {
    const nameField = itemType === 'product' ? item.name : item.title;
    setImageModal({
      open: true,
      itemType,
      itemId: item.id,
      itemName: nameField,
      images: item.images || []
    });
  };

  // Add image to gallery
  const handleAddGalleryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingGalleryImage(true);
    setError('');
    
    try {
      const result = await uploadImage(file, imageModal.itemType + 's');
      await addItemImage(imageModal.itemType, imageModal.itemId, result.imageUrl);
      
      // Refresh data
      await loadData();
      
      // Update modal images
      const updatedData = imageModal.itemType === 'product' ? products : 
                          imageModal.itemType === 'service' ? services :
                          imageModal.itemType === 'workshop' ? workshops : projects;
      const updatedItem = updatedData.find(i => i.id === imageModal.itemId);
      if (updatedItem) {
        setImageModal(prev => ({ ...prev, images: updatedItem.images || [] }));
      }
      
      setSuccess('Image added to gallery!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add image: ' + err.message);
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  // Remove image from gallery
  const handleRemoveGalleryImage = async (imageId) => {
    if (!confirm('Remove this image from gallery?')) return;
    
    try {
      await deleteItemImage(imageId);
      
      // Refresh data
      await loadData();
      
      // Update modal images
      setImageModal(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
      
      setSuccess('Image removed!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to remove image');
    }
  };

  // Product handlers
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...productForm, price: parseFloat(productForm.price) });
      setProductForm({ name: '', price: '', category: '', description: '', image_url: '' });
      loadData();
      setSuccess('Product created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  // Service handlers
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await createService(serviceForm);
      setServiceForm({ title: '', description: '', image_url: '' });
      loadData();
      setSuccess('Service created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteService(id);
      loadData();
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  // Workshop handlers
  const handleCreateWorkshop = async (e) => {
    e.preventDefault();
    try {
      await createWorkshop({ ...workshopForm, price: workshopForm.price ? parseFloat(workshopForm.price) : null });
      setWorkshopForm({ title: '', description: '', schedule_date: '', price: '', image_url: '' });
      loadData();
      setSuccess('Workshop created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create workshop');
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteWorkshop(id);
      loadData();
    } catch (err) {
      setError('Failed to delete workshop');
    }
  };

  // Project handlers
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(projectForm);
      setProjectForm({ title: '', description: '', customer_feedback: '', image_url: '' });
      loadData();
      setSuccess('Project created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteProject(id);
      loadData();
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  // Message handlers
  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteMessage(id);
      loadData();
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  // Testimonial handlers
  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    try {
      await createTestimonial(testimonialForm);
      setTestimonialForm({ customer_name: '', customer_title: '', content: '', rating: 5, image_url: '', is_featured: false });
      loadData();
      setSuccess('Testimonial created!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create testimonial');
    }
  };

  const handleToggleFeatured = async (testimonial) => {
    try {
      await updateTestimonial(testimonial.id, { ...testimonial, is_featured: !testimonial.is_featured });
      loadData();
    } catch (err) {
      setError('Failed to update testimonial');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteTestimonial(id);
      loadData();
    } catch (err) {
      setError('Failed to delete testimonial');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const ImageUploadField = ({ category, form, setForm, fieldName = 'image_url' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={form[fieldName] || ''}
          onChange={(e) => setForm({ ...form, [fieldName]: e.target.value })}
          placeholder="Image URL or upload"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <label className={`px-4 py-2 bg-gray-600 text-white rounded-md cursor-pointer hover:bg-gray-700 text-sm ${uploadingImage ? 'opacity-50' : ''}`}>
          {uploadingImage ? '...' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, category, setForm)}
            disabled={uploadingImage}
          />
        </label>
      </div>
      {form[fieldName] && (
        <img src={form[fieldName]} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right">&times;</button>
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {success}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-pink-600">{products.length}</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-blue-600">{services.length}</div>
            <div className="text-sm text-gray-500">Services</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-600">{workshops.length}</div>
            <div className="text-sm text-gray-500">Workshops</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-purple-600">{projects.length}</div>
            <div className="text-sm text-gray-500">Projects</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-yellow-600">{testimonials.length}</div>
            <div className="text-sm text-gray-500">Testimonials</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-red-600">{messages.length}</div>
            <div className="text-sm text-gray-500">Messages</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {['products', 'services', 'workshops', 'projects', 'testimonials', 'messages'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} ({tab === 'products' ? products.length : tab === 'services' ? services.length : tab === 'workshops' ? workshops.length : tab === 'projects' ? projects.length : tab === 'testimonials' ? testimonials.length : messages.length})
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6 pb-12">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add Product</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <input type="text" placeholder="Name" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="number" step="0.01" placeholder="Price" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select Category</option>
                    <option value="Hand-Flower">Hand-Flower</option>
                    <option value="ROM">ROM</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Event">Event</option>
                  </select>
                  <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
                  <ImageUploadField category="products" form={productForm} setForm={setProductForm} />
                  <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Add Product</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gallery</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-4"><img src={product.image_url || '/assets/images/img_1.svg'} alt="" className="h-12 w-12 object-cover rounded" /></td>
                          <td className="px-4 py-4 text-sm">{product.name}</td>
                          <td className="px-4 py-4 text-sm">${product.price}</td>
                          <td className="px-4 py-4 text-sm">{product.category}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => openImageModal('product', product)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {(product.images?.length || 0) + 1}
                            </button>
                          </td>
                          <td className="px-4 py-4"><button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add Service</h3>
                <form onSubmit={handleCreateService} className="space-y-4">
                  <input type="text" placeholder="Title" required value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <textarea placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
                  <ImageUploadField category="services" form={serviceForm} setForm={setServiceForm} />
                  <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Add Service</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gallery</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.map((service) => (
                        <tr key={service.id}>
                          <td className="px-4 py-4"><img src={service.image_url || '/assets/images/img_1.svg'} alt="" className="h-12 w-12 object-cover rounded" /></td>
                          <td className="px-4 py-4 text-sm font-medium">{service.title}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{service.description}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => openImageModal('service', service)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {(service.images?.length || 0) + 1}
                            </button>
                          </td>
                          <td className="px-4 py-4"><button onClick={() => handleDeleteService(service.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Workshops Tab */}
          {activeTab === 'workshops' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add Workshop</h3>
                <form onSubmit={handleCreateWorkshop} className="space-y-4">
                  <input type="text" placeholder="Title" required value={workshopForm.title} onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <textarea placeholder="Description" value={workshopForm.description} onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
                  <input type="date" value={workshopForm.schedule_date} onChange={(e) => setWorkshopForm({ ...workshopForm, schedule_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="number" step="0.01" placeholder="Price" value={workshopForm.price} onChange={(e) => setWorkshopForm({ ...workshopForm, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <ImageUploadField category="workshops" form={workshopForm} setForm={setWorkshopForm} />
                  <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Add Workshop</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gallery</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workshops.map((workshop) => (
                        <tr key={workshop.id}>
                          <td className="px-4 py-4"><img src={workshop.image_url || '/assets/images/img_1.svg'} alt="" className="h-12 w-12 object-cover rounded" /></td>
                          <td className="px-4 py-4 text-sm font-medium">{workshop.title}</td>
                          <td className="px-4 py-4 text-sm">{workshop.schedule_date ? new Date(workshop.schedule_date).toLocaleDateString() : '-'}</td>
                          <td className="px-4 py-4 text-sm">{workshop.price ? `$${workshop.price}` : '-'}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => openImageModal('workshop', workshop)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {(workshop.images?.length || 0) + 1}
                            </button>
                          </td>
                          <td className="px-4 py-4"><button onClick={() => handleDeleteWorkshop(workshop.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add Project</h3>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <input type="text" placeholder="Title" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <textarea placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
                  <textarea placeholder="Customer Feedback" value={projectForm.customer_feedback} onChange={(e) => setProjectForm({ ...projectForm, customer_feedback: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="2" />
                  <ImageUploadField category="projects" form={projectForm} setForm={setProjectForm} />
                  <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Add Project</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gallery</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-4 py-4"><img src={project.image_url || '/assets/images/img_1.svg'} alt="" className="h-12 w-12 object-cover rounded" /></td>
                          <td className="px-4 py-4 text-sm font-medium">{project.title}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{project.description}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => openImageModal('project', project)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {(project.images?.length || 0) + 1}
                            </button>
                          </td>
                          <td className="px-4 py-4"><button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add Testimonial</h3>
                <form onSubmit={handleCreateTestimonial} className="space-y-4">
                  <input type="text" placeholder="Customer Name" required value={testimonialForm.customer_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, customer_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" placeholder="Title (e.g., Wedding Client)" value={testimonialForm.customer_title} onChange={(e) => setTestimonialForm({ ...testimonialForm, customer_title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <textarea placeholder="Testimonial content" required value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="4" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                          className={`text-2xl ${star <= testimonialForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <ImageUploadField category="testimonials" form={testimonialForm} setForm={setTestimonialForm} />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={testimonialForm.is_featured}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, is_featured: e.target.checked })}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Featured on homepage</span>
                  </label>
                  <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Add Testimonial</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testimonials.map((testimonial) => (
                        <tr key={testimonial.id}>
                          <td className="px-4 py-4">
                            <img src={testimonial.image_url || '/assets/images/sq_img_1.svg'} alt="" className="h-12 w-12 object-cover rounded-full" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium">{testimonial.customer_name}</div>
                            {testimonial.customer_title && <div className="text-xs text-gray-500">{testimonial.customer_title}</div>}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{testimonial.content}</td>
                          <td className="px-4 py-4">
                            <div className="flex text-yellow-400">
                              {[...Array(testimonial.rating)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleToggleFeatured(testimonial)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                testimonial.is_featured
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {testimonial.is_featured ? 'Featured' : 'Not Featured'}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <button onClick={() => handleDeleteTestimonial(testimonial.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((msg) => (
                      <tr key={msg.id}>
                        <td className="px-6 py-4 text-sm font-medium">{msg.user_name}</td>
                        <td className="px-6 py-4 text-sm">{msg.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">{msg.content}</td>
                        <td className="px-6 py-4 text-sm">{new Date(msg.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4"><button onClick={() => handleDeleteMessage(msg.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" required value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {imageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Manage Gallery: {imageModal.itemName}</h3>
              <button onClick={() => setImageModal({ open: false, itemType: '', itemId: null, itemName: '', images: [] })} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Add new image */}
              <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <label className={`cursor-pointer ${uploadingGalleryImage ? 'opacity-50' : ''}`}>
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-gray-600">{uploadingGalleryImage ? 'Uploading...' : 'Click to add image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddGalleryImage}
                    disabled={uploadingGalleryImage}
                  />
                </label>
              </div>

              {/* Existing images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imageModal.images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.image_url}
                      alt="Gallery"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/img_1.svg';
                      }}
                    />
                    <button
                      onClick={() => handleRemoveGalleryImage(img.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {imageModal.images.length === 0 && (
                <p className="text-center text-gray-500 py-8">No additional images in gallery. Add images above.</p>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-500 text-center">
                The main image is set in the item form. Gallery images appear on the detail page.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
