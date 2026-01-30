# Flower Shop Application

A fully containerized full-stack flower shop application built with:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + mysql2
- **Database**: MySQL 8.0
- **Reverse Proxy**: Nginx

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AWS EC2 / Docker Host               │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Docker Network                 │   │
│  │                                                  │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐  │   │
│  │  │   Nginx  │───▶│  Server  │───▶│  MySQL   │  │   │
│  │  │  :80     │    │  :3000   │    │  :3306   │  │   │
│  │  └──────────┘    └──────────┘    └──────────┘  │   │
│  │       │                                         │   │
│  │       │ (serves)                                │   │
│  │       ▼                                         │   │
│  │  ┌──────────┐                                   │   │
│  │  │  React   │ (built static files)              │   │
│  │  │  Build   │                                   │   │
│  │  └──────────┘                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                           │                             │
│                           │ Port 80 only                │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
                     External Traffic
```

## Project Structure

```
flower-shop/
├── docker-compose.yml      # Docker orchestration
├── .env                    # Environment variables
├── README.md              
├── db/
│   └── init.sql            # Database schema + sample data
├── server/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js            # Express API
├── client/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── public/
│   │   └── assets/
│   │       └── images/     # ⚠️ ADD YOUR IMAGES HERE
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       ├── components/     # Reusable UI components
│       └── pages/          # Page components
└── nginx/
    ├── Dockerfile
    └── nginx.conf
```

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Port 80 available on your machine/server

### 1. Add Your Images

Copy your images to `client/public/assets/images/`. Required images:

| Filename | Description | Suggested Size |
|----------|-------------|----------------|
| `logo.webp` | Site logo | 100x100px |
| `bg_1.jpg` | Hero background | 1920x1080px |
| `img_1.jpg` - `img_5.jpg` | Product/service images | 800x600px |
| `sq_img_1.jpg` - `sq_img_5.jpg` | Square images | 600x600px |
| `person_1.jpg` | Testimonial photo | 200x200px |

### 2. Start the Application

```bash
cd flower-shop
docker compose up -d --build
```

### 3. Access the Application

- **Website**: http://localhost/ (or http://YOUR_EC2_IP/)
- **Admin Panel**: http://localhost/admin
- **Health Check**: http://localhost/api/health

## API Endpoints

### Health Check
```bash
curl http://localhost/api/health
```

### Products
```bash
# Get all products
curl http://localhost/api/products

# Get single product
curl http://localhost/api/products/1

# Create product
curl -X POST http://localhost/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"New Flower","price":99.99,"category":"Hand-Flower","image_url":"/assets/images/img_1.jpg"}'

# Delete product
curl -X DELETE http://localhost/api/products/1
```

### Services
```bash
curl http://localhost/api/services
curl -X POST http://localhost/api/services \
  -H "Content-Type: application/json" \
  -d '{"title":"New Service","description":"Service description","image_url":"/assets/images/img_1.jpg"}'
curl -X DELETE http://localhost/api/services/1
```

### Workshops
```bash
curl http://localhost/api/workshops
curl -X POST http://localhost/api/workshops \
  -H "Content-Type: application/json" \
  -d '{"title":"New Workshop","description":"Learn floristry","schedule_date":"2024-03-15","price":75.00,"image_url":"/assets/images/img_1.jpg"}'
curl -X DELETE http://localhost/api/workshops/1
```

### Projects
```bash
curl http://localhost/api/projects
curl -X POST http://localhost/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"Wedding Project","description":"Beautiful wedding","customer_feedback":"Amazing work!","image_url":"/assets/images/img_1.jpg"}'
curl -X DELETE http://localhost/api/projects/1
```

### Messages (Contact Form)
```bash
curl http://localhost/api/messages
curl -X POST http://localhost/api/messages \
  -H "Content-Type: application/json" \
  -d '{"user_name":"John Doe","email":"john@example.com","content":"I would like to inquire about your services."}'
curl -X DELETE http://localhost/api/messages/1
```

## AWS EC2 Deployment

### Security Group Configuration
Allow inbound traffic:
- **Type**: HTTP
- **Port**: 80
- **Source**: 0.0.0.0/0 (or your specific IP range)

### Deployment Steps

1. **SSH into EC2 instance**
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

2. **Install Docker (Amazon Linux 2)**
```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Log out and back in** (for docker group permissions)

4. **Upload project files**
```bash
scp -i your-key.pem -r flower-shop ec2-user@your-ec2-ip:~
```

5. **Start the application**
```bash
cd flower-shop
docker compose up -d --build
```

6. **Verify deployment**
```bash
curl http://localhost/api/health
```

## Troubleshooting

### Database not initializing
```bash
# Remove existing volume and restart
docker compose down -v
docker compose up -d --build
```

### Server cannot connect to database
```bash
# Check if DB is healthy
docker compose ps
docker compose logs db

# Verify environment variables
docker compose exec server env | grep DB_
```

### Nginx returning 502
```bash
# Check server logs
docker compose logs server

# Verify server is running
docker compose exec nginx curl http://server:3000/api/health
```

### Images not loading
1. Ensure images are in `client/public/assets/images/`
2. Rebuild the client:
```bash
docker compose up -d --build client
docker compose restart nginx
```

### View all logs
```bash
docker compose logs -f
```

### Access container shell
```bash
docker compose exec server sh
docker compose exec nginx sh
docker compose exec db mysql -u flower_user -p flower_shop
```

## Environment Variables

Edit `.env` to customize:

```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=flower_shop
MYSQL_USER=flower_user
MYSQL_PASSWORD=your_secure_password
NODE_ENV=production
```

## Template Component Mapping

| Original HTML Section | React Component |
|----------------------|-----------------|
| Navbar | `<Navbar />` |
| Hero/Cover | `<Hero />` |
| Product grid | `<ProductCard />` |
| Service cards | `<ServiceCard />` |
| Half-section layout | `<HalfSection />` |
| Workshop cards | `<WorkshopCard />` |
| Project showcase | `<ProjectCard />` |
| Testimonial blockquote | `<Testimonial />` |
| Contact form | `<ContactForm />` |
| Footer | `<Footer />` |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, featured products, services overview |
| `/products` | Products | All products with category filter |
| `/services` | Services | All services |
| `/workshops` | Workshops | Workshop listings and info |
| `/projects` | Projects | Past work portfolio |
| `/contact` | Contact | Contact form and info |
| `/about` | About | Company information |
| `/admin` | Admin | Dashboard for CRUD operations |

## License

Based on ProBootstrap template (Creative Commons 3.0). 
See [ProBootstrap License](https://probootstrap.com/license/).
