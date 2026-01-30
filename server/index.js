const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'flower-shop-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static('/app/uploads'));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'flower_user',
  password: process.env.DB_PASSWORD || 'flower_password',
  database: process.env.DB_NAME || 'flower_shop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to execute queries
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Helper function to get item images
async function getItemImages(itemType, itemId) {
  const images = await query(
    'SELECT id, image_url, alt_text, sort_order FROM item_images WHERE item_type = ? AND item_id = ? ORDER BY sort_order ASC',
    [itemType, itemId]
  );
  return images;
}

// Ensure upload directories exist
const uploadDirs = ['products', 'services', 'workshops', 'projects', 'general'];
uploadDirs.forEach(dir => {
  const dirPath = `/app/uploads/${dir}`;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.params.category || 'general';
    const uploadPath = `/app/uploads/${category}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Initialize database tables and admin user
async function initializeDatabase() {
  try {
    // Check if admin_users table exists
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create item_images table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS item_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_type ENUM('product', 'service', 'workshop', 'project') NOT NULL,
        item_id INT NOT NULL,
        image_url TEXT NOT NULL,
        alt_text VARCHAR(255) DEFAULT '',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_item (item_type, item_id)
      )
    `);
    
    // Create testimonials table
    await query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_title VARCHAR(255),
        content TEXT NOT NULL,
        rating INT DEFAULT 5,
        image_url TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add description column to products if not exists
    try {
      await query('ALTER TABLE products ADD COLUMN description TEXT');
    } catch (e) {
      // Column might already exist
    }
    
    // Add alt_text column to item_images if not exists
    try {
      await query('ALTER TABLE item_images ADD COLUMN alt_text VARCHAR(255) DEFAULT ""');
    } catch (e) {
      // Column might already exist
    }
    
    // Create default admin user if not exists
    const [existing] = await query('SELECT id FROM admin_users WHERE username = ?', ['admin']);
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await query('INSERT INTO admin_users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Default admin user created (username: admin, password: admin123)');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [user] = await query('SELECT id, username FROM admin_users WHERE id = ?', [decoded.userId]);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Authentication error' });
  }
};

// ========================
// Health Check
// ========================
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// ========================
// Auth Endpoints
// ========================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [user] = await query('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const [user] = await query('SELECT * FROM admin_users WHERE id = ?', [req.user.id]);
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE admin_users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ========================
// Image Upload Endpoint
// ========================
app.post('/api/upload/:category', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const category = req.params.category || 'general';
    const imageUrl = `/uploads/${category}/${req.file.filename}`;
    
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image endpoint
app.delete('/api/upload', authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }
    
    const filePath = `/app${imageUrl}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ========================
// Item Images Endpoints (Multi-image support)
// ========================
app.get('/api/item-images/:itemType/:itemId', async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const images = await getItemImages(itemType, itemId);
    res.json(images);
  } catch (error) {
    console.error('Error fetching item images:', error);
    res.status(500).json({ error: 'Failed to fetch item images' });
  }
});

app.post('/api/item-images', authMiddleware, async (req, res) => {
  try {
    const { item_type, item_id, image_url, alt_text } = req.body;
    
    if (!item_type || !item_id || !image_url) {
      return res.status(400).json({ error: 'item_type, item_id, and image_url are required' });
    }
    
    // Get max sort_order for this item
    const [maxOrder] = await query(
      'SELECT MAX(sort_order) as max_order FROM item_images WHERE item_type = ? AND item_id = ?',
      [item_type, item_id]
    );
    const nextOrder = (maxOrder?.max_order || 0) + 1;
    
    const result = await query(
      'INSERT INTO item_images (item_type, item_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)',
      [item_type, item_id, image_url, alt_text || '', nextOrder]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      item_type, 
      item_id, 
      image_url,
      alt_text: alt_text || '',
      sort_order: nextOrder,
      message: 'Image added successfully' 
    });
  } catch (error) {
    console.error('Error adding item image:', error);
    res.status(500).json({ error: 'Failed to add item image' });
  }
});

// Update image alt_text
app.put('/api/item-images/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text } = req.body;
    
    const result = await query(
      'UPDATE item_images SET alt_text = ? WHERE id = ?',
      [alt_text || '', id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error('Error updating item image:', error);
    res.status(500).json({ error: 'Failed to update item image' });
  }
});

// Reorder images
app.put('/api/item-images/reorder/:itemType/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const { imageIds } = req.body; // Array of image IDs in new order
    
    if (!Array.isArray(imageIds)) {
      return res.status(400).json({ error: 'imageIds must be an array' });
    }
    
    // Update sort_order for each image
    for (let i = 0; i < imageIds.length; i++) {
      await query(
        'UPDATE item_images SET sort_order = ? WHERE id = ? AND item_type = ? AND item_id = ?',
        [i + 1, imageIds[i], itemType, itemId]
      );
    }
    
    res.json({ message: 'Images reordered successfully' });
  } catch (error) {
    console.error('Error reordering images:', error);
    res.status(500).json({ error: 'Failed to reorder images' });
  }
});

app.delete('/api/item-images/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get image info before deleting
    const [image] = await query('SELECT * FROM item_images WHERE id = ?', [id]);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Delete from database
    await query('DELETE FROM item_images WHERE id = ?', [id]);
    
    // Try to delete file if it's an uploaded file
    if (image.image_url && image.image_url.startsWith('/uploads/')) {
      const filePath = `/app${image.image_url}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting item image:', error);
    res.status(500).json({ error: 'Failed to delete item image' });
  }
});

// ========================
// Products Endpoints
// ========================
app.get('/api/products', async (req, res) => {
  try {
    const products = await query('SELECT * FROM products ORDER BY created_at DESC');
    
    // Add images array to each product
    for (let product of products) {
      product.images = await getItemImages('product', product.id);
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [product] = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Add images array
    product.images = await getItemImages('product', product.id);
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { name, price, category, description, image_url } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price are required' });
    
    const result = await query(
      'INSERT INTO products (name, price, category, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, price, category || null, description || null, image_url || null]
    );
    
    res.status(201).json({ id: result.insertId, name, price, category, description, image_url, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { name, price, category, description, image_url } = req.body;
    await query(
      'UPDATE products SET name = ?, price = ?, category = ?, description = ?, image_url = ? WHERE id = ?',
      [name, price, category, description, image_url, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    // Delete associated images first
    await query('DELETE FROM item_images WHERE item_type = ? AND item_id = ?', ['product', req.params.id]);
    
    const result = await query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ========================
// Services Endpoints
// ========================
app.get('/api/services', async (req, res) => {
  try {
    const services = await query('SELECT * FROM services ORDER BY created_at DESC');
    
    // Add images array to each service
    for (let service of services) {
      service.images = await getItemImages('service', service.id);
    }
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const [service] = await query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    
    // Add images array
    service.images = await getItemImages('service', service.id);
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

app.post('/api/services', authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    
    const result = await query(
      'INSERT INTO services (title, description, image_url) VALUES (?, ?, ?)',
      [title, description || null, image_url || null]
    );
    
    res.status(201).json({ id: result.insertId, title, description, image_url, message: 'Service created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url } = req.body;
    await query(
      'UPDATE services SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [title, description, image_url, req.params.id]
    );
    res.json({ message: 'Service updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    // Delete associated images first
    await query('DELETE FROM item_images WHERE item_type = ? AND item_id = ?', ['service', req.params.id]);
    
    const result = await query('DELETE FROM services WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ========================
// Workshops Endpoints
// ========================
app.get('/api/workshops', async (req, res) => {
  try {
    const workshops = await query('SELECT * FROM workshops ORDER BY schedule_date ASC');
    
    // Add images array to each workshop
    for (let workshop of workshops) {
      workshop.images = await getItemImages('workshop', workshop.id);
    }
    
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

app.get('/api/workshops/:id', async (req, res) => {
  try {
    const [workshop] = await query('SELECT * FROM workshops WHERE id = ?', [req.params.id]);
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
    
    // Add images array
    workshop.images = await getItemImages('workshop', workshop.id);
    
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workshop' });
  }
});

app.post('/api/workshops', authMiddleware, async (req, res) => {
  try {
    const { title, description, schedule_date, price, image_url } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    
    const result = await query(
      'INSERT INTO workshops (title, description, schedule_date, price, image_url) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, schedule_date || null, price || null, image_url || null]
    );
    
    res.status(201).json({ id: result.insertId, title, description, schedule_date, price, image_url, message: 'Workshop created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workshop' });
  }
});

app.put('/api/workshops/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, schedule_date, price, image_url } = req.body;
    await query(
      'UPDATE workshops SET title = ?, description = ?, schedule_date = ?, price = ?, image_url = ? WHERE id = ?',
      [title, description, schedule_date, price, image_url, req.params.id]
    );
    res.json({ message: 'Workshop updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workshop' });
  }
});

app.delete('/api/workshops/:id', authMiddleware, async (req, res) => {
  try {
    // Delete associated images first
    await query('DELETE FROM item_images WHERE item_type = ? AND item_id = ?', ['workshop', req.params.id]);
    
    const result = await query('DELETE FROM workshops WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Workshop not found' });
    res.json({ message: 'Workshop deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workshop' });
  }
});

// ========================
// Projects Endpoints
// ========================
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
    
    // Add images array to each project
    for (let project of projects) {
      project.images = await getItemImages('project', project.id);
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const [project] = await query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Add images array
    project.images = await getItemImages('project', project.id);
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const { title, description, customer_feedback, image_url } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    
    const result = await query(
      'INSERT INTO projects (title, description, customer_feedback, image_url) VALUES (?, ?, ?, ?)',
      [title, description || null, customer_feedback || null, image_url || null]
    );
    
    res.status(201).json({ id: result.insertId, title, description, customer_feedback, image_url, message: 'Project created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, customer_feedback, image_url } = req.body;
    await query(
      'UPDATE projects SET title = ?, description = ?, customer_feedback = ?, image_url = ? WHERE id = ?',
      [title, description, customer_feedback, image_url, req.params.id]
    );
    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    // Delete associated images first
    await query('DELETE FROM item_images WHERE item_type = ? AND item_id = ?', ['project', req.params.id]);
    
    const result = await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ========================
// Messages Endpoints
// ========================
app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { user_name, email, content } = req.body;
    if (!user_name || !email || !content) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const result = await query(
      'INSERT INTO messages (user_name, email, content) VALUES (?, ?, ?)',
      [user_name, email, content]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ========================
// Testimonials Endpoints
// ========================
app.get('/api/testimonials', async (req, res) => {
  try {
    const { featured } = req.query;
    let testimonials;
    
    if (featured === 'true') {
      testimonials = await query('SELECT * FROM testimonials WHERE is_featured = TRUE ORDER BY created_at DESC');
    } else {
      testimonials = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
    }
    
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.get('/api/testimonials/:id', async (req, res) => {
  try {
    const [testimonial] = await query('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

app.post('/api/testimonials', authMiddleware, async (req, res) => {
  try {
    const { customer_name, customer_title, content, rating, image_url, is_featured } = req.body;
    if (!customer_name || !content) {
      return res.status(400).json({ error: 'Customer name and content are required' });
    }
    
    const result = await query(
      'INSERT INTO testimonials (customer_name, customer_title, content, rating, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [customer_name, customer_title || null, content, rating || 5, image_url || null, is_featured || false]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      customer_name, 
      customer_title, 
      content, 
      rating: rating || 5,
      image_url, 
      is_featured: is_featured || false,
      message: 'Testimonial created' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const { customer_name, customer_title, content, rating, image_url, is_featured } = req.body;
    await query(
      'UPDATE testimonials SET customer_name = ?, customer_title = ?, content = ?, rating = ?, image_url = ?, is_featured = ? WHERE id = ?',
      [customer_name, customer_title, content, rating, image_url, is_featured, req.params.id]
    );
    res.json({ message: 'Testimonial updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ========================
// Search Endpoint
// ========================
app.get('/api/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ results: [] });
    }
    
    const searchTerm = `%${q}%`;
    let results = { products: [], services: [], workshops: [], projects: [] };
    
    if (!type || type === 'all' || type === 'products') {
      results.products = await query(
        'SELECT id, name, category, description, image_url, "product" as type FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ? LIMIT 10',
        [searchTerm, searchTerm, searchTerm]
      );
    }
    
    if (!type || type === 'all' || type === 'services') {
      results.services = await query(
        'SELECT id, title, description, image_url, "service" as type FROM services WHERE title LIKE ? OR description LIKE ? LIMIT 10',
        [searchTerm, searchTerm]
      );
    }
    
    if (!type || type === 'all' || type === 'workshops') {
      results.workshops = await query(
        'SELECT id, title, description, schedule_date, image_url, "workshop" as type FROM workshops WHERE title LIKE ? OR description LIKE ? LIMIT 10',
        [searchTerm, searchTerm]
      );
    }
    
    if (!type || type === 'all' || type === 'projects') {
      results.projects = await query(
        'SELECT id, title, description, image_url, "project" as type FROM projects WHERE title LIKE ? OR description LIKE ? LIMIT 10',
        [searchTerm, searchTerm]
      );
    }
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ========================
// Error Handlers
// ========================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Flower Shop API running on port ${PORT}`);
  setTimeout(initializeDatabase, 3000);
});
