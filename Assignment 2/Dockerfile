# ============================================================
# Dockerfile — Optimized Nginx Web Server with Store & App
# Assignment: Containerization & Kubernetes Deployment
# ============================================================

FROM nginx:1.25-alpine

LABEL maintainer="Sagar"
LABEL description="Containerized Nginx web application for Kubernetes assignment"
LABEL version="1.0"

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy all static web assets (HTML, CSS, JS, Images)
COPY *.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY hero.jpg /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
