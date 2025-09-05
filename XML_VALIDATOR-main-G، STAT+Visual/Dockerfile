# ---- Build React Frontend ----
    FROM node:18 AS frontend-build

    # Set working directory
    WORKDIR /app
    
    # Copy only package.json + lock file first (better caching)
    COPY package*.json ./
    
    # Install React dependencies
    RUN npm install
    
    # Copy React source code
    COPY public ./public
    COPY src ./src
    
    # Build React app
    RUN npm run build
    
    
    # ---- Backend + Final Image ----
    FROM python:3.11-slim
    
    # Set working directory
    WORKDIR /app
    
    # Install backend dependencies
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Copy backend files
    COPY app.py .
    COPY data ./data
    COPY valid_xmls ./valid_xmls
    COPY invalid_xmls ./invalid_xmls
    
    # Copy built React app from frontend stage
    COPY --from=frontend-build /app/build ./build
    
    # Environment
    ENV PORT=5000
    ENV FLASK_ENV=production
    
    # Expose port
    EXPOSE 5000
    
    # Run Flask backend (serving React build too)
    CMD ["python", "app.py"]
    