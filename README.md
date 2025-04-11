# Mohammad A. Alassiri Portfolio

A comprehensive full-stack portfolio application showcasing 10 interactive demos with a focus on scalable architecture and enhanced user experience.

## Features

- **10 Interactive Demo Applications**
  - Point of Sale (POS) System
  - Fruit Store
  - Marketing Agency with Chatbot
  - Business Intelligence Dashboard
  - Statistical Arbitrage Tool
  - Triangular Arbitrage Tool
  - dYdX Trading Interface
  - Educational AI English Learning App
  - Hair & Beauty Center Website
  - Reddit Clone

- **Technical Features**
  - Full-stack React/TypeScript with Express backend
  - PostgreSQL database integration using Drizzle ORM
  - JWT-based authentication system
  - NGINX configuration for reverse proxy and SSL
  - Docker containerization for easy deployment
  - Responsive design with Tailwind CSS
  - Animation with Framer Motion
  - Content Management System
  - Admin dashboard for content editing

## Technology Stack

- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - TanStack Query for data fetching
  - ShadCN UI components
  - React Hook Form for form management
  - Zod for schema validation

- **Backend**
  - Express.js server
  - PostgreSQL database
  - Drizzle ORM for database operations
  - JSON Web Tokens for authentication
  - Session management

- **DevOps**
  - Docker containerization
  - NGINX for reverse proxy
  - Docker Compose for orchestration
  - Oracle Cloud deployment-ready

## Setup and Deployment

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (or use the containerized version)
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5000`

### Production Deployment on Oracle Cloud

1. Set up your Oracle Cloud VM instance
   - Create a VM with Ubuntu 22.04 (minimum 2 OCPUs, 4GB RAM)
   - Open ports 80, 443, 22 (SSH), and 5000 in the security list

2. Initialize the server environment:
   ```bash
   # SSH into your Oracle Cloud VM
   ssh opc@your-vm-ip-address -i your-private-key.pem
   
   # Clone the repository 
   git clone https://github.com/yourusername/portfolio.git /opt/portfolio
   cd /opt/portfolio
   
   # Run the server setup script (installs Docker, NGINX, etc.)
   sudo ./scripts/setup-server.sh
   ```

3. Set up SSL certificates with Let's Encrypt:
   ```bash
   # Make sure your domain is pointing to your Oracle Cloud VM
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   
   # Copy certificates to nginx folder
   sudo mkdir -p /opt/portfolio/nginx/ssl
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/portfolio/nginx/ssl/server.crt
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/portfolio/nginx/ssl/server.key
   sudo chown -R $USER:$USER /opt/portfolio/nginx/ssl
   ```

4. Configure environment variables:
   ```bash
   cp .env.production.sample .env
   
   # Edit the .env file with your production values
   nano .env
   
   # Be sure to set secure values for:
   # - DATABASE_URL (with your actual database credentials)
   # - JWT_SECRET (generate a secure random string)
   # - SESSION_SECRET (generate a different secure random string)
   # - APP_DOMAIN (set to your actual domain name)
   # - OPENAI_API_KEY (if using the chatbot feature)
   ```

5. Deploy the application:
   ```bash
   # Run the automated deployment script
   ./scripts/deploy.sh
   ```

6. Your application should now be running at your domain with HTTPS enabled

7. Monitor the application:
   ```bash
   # View container status
   docker-compose ps
   
   # View application logs
   docker-compose logs -f app
   
   # Restart if needed
   docker-compose restart app
   ```

### Database Migration and Seeding

The application comes with scripts to initialize and seed the database:

```bash
# Apply database migrations
npm run db:push

# Seed the database with initial data (optional)
npm run db:seed
```

## Folder Structure

```
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   └── src/            # Source files
│       ├── components/ # Reusable UI components
│       ├── hooks/      # Custom React hooks
│       ├── lib/        # Utility functions
│       ├── pages/      # Main application pages
│       └── types/      # TypeScript type definitions
├── server/             # Backend Express server
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   └── index.ts        # Server entry point
├── shared/             # Shared code between client and server
│   └── schema.ts       # Database schema definitions
├── nginx/              # NGINX configuration
├── scripts/            # Utility scripts
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── .env.example        # Environment variables template
```

## Customization

To customize the portfolio content:

1. Log in to the admin panel at `/admin`
2. Use the CMS dashboard to update projects, settings, and content
3. Changes are stored in the database and immediately reflected on the site

## Contact

For questions or contributions, please contact:
- Email: me@alassiri.nl
- Phone: +316 1097 9730
- Website: https://alassiri.nl

## License

All rights reserved. © 2025 Mohammad A. Alassiri