#!/bin/bash

# Docker Build & Deploy Script for MSiT AI Assistant
# This script builds Docker images and optionally pushes to Docker Hub or Railway

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 MSiT AI Assistant - Docker Build Script${NC}"
echo "=================================================="

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}→ $1${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker."
    exit 1
fi

print_success "Docker is ready"

# Parse command line arguments
BUILD_BACKEND=true
BUILD_FRONTEND=true
TEST_LOCALLY=false
PUSH_IMAGES=false
DOCKER_REGISTRY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            BUILD_FRONTEND=false
            shift
            ;;
        --frontend-only)
            BUILD_BACKEND=false
            shift
            ;;
        --test)
            TEST_LOCALLY=true
            shift
            ;;
        --push)
            PUSH_IMAGES=true
            DOCKER_REGISTRY="${2:-docker.io}"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Build backend
if [ "$BUILD_BACKEND" = true ]; then
    print_section "Building Backend Image"
    
    cd "$PROJECT_ROOT"
    
    if docker build -f backend/Dockerfile -t msit-backend:latest .; then
        print_success "Backend image built successfully"
        BACKEND_SIZE=$(docker images msit-backend:latest --format "{{.Size}}")
        echo "  Size: $BACKEND_SIZE"
    else
        print_error "Failed to build backend image"
        exit 1
    fi
fi

# Build frontend
if [ "$BUILD_FRONTEND" = true ]; then
    print_section "Building Frontend Image"
    
    cd "$PROJECT_ROOT"
    
    if docker build -f frontend/Dockerfile -t msit-frontend:latest .; then
        print_success "Frontend image built successfully"
        FRONTEND_SIZE=$(docker images msit-frontend:latest --format "{{.Size}}")
        echo "  Size: $FRONTEND_SIZE"
    else
        print_error "Failed to build frontend image"
        exit 1
    fi
fi

# Test locally with docker-compose
if [ "$TEST_LOCALLY" = true ]; then
    print_section "Testing with Docker Compose"
    
    # Check if .env file exists
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        print_error ".env file not found"
        echo "Please create .env file with:"
        echo "  SUPABASE_URL=your_value"
        echo "  SUPABASE_ANON_KEY=your_value"
        echo "  SUPABASE_SERVICE_KEY=your_value"
        echo "  OPENAI_API_KEY=your_value"
        exit 1
    fi
    
    print_success ".env file found"
    
    # Start services
    echo "Starting Docker Compose services..."
    cd "$PROJECT_ROOT"
    docker-compose up -d
    
    sleep 3
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Services started successfully"
        echo ""
        echo "Access your application at:"
        echo "  Frontend: http://localhost:5173"
        echo "  Backend:  http://localhost:3001"
        echo ""
        echo "View logs with:"
        echo "  docker-compose logs -f"
        echo ""
        echo "Stop with:"
        echo "  docker-compose down"
    else
        print_error "Services failed to start"
        docker-compose logs
        exit 1
    fi
fi

# Push images to registry
if [ "$PUSH_IMAGES" = true ]; then
    print_section "Pushing Images to Registry"
    
    if [ -z "$DOCKER_REGISTRY" ]; then
        echo "Enter Docker registry username (leave blank for Docker Hub public):"
        read -r REGISTRY_USER
        DOCKER_REGISTRY="${REGISTRY_USER}/"
    fi
    
    if [ "$BUILD_BACKEND" = true ]; then
        BACKEND_TAG="${DOCKER_REGISTRY}msit-backend:latest"
        docker tag msit-backend:latest "$BACKEND_TAG"
        
        echo "Pushing backend to $BACKEND_TAG..."
        if docker push "$BACKEND_TAG"; then
            print_success "Backend pushed successfully"
        else
            print_error "Failed to push backend"
        fi
    fi
    
    if [ "$BUILD_FRONTEND" = true ]; then
        FRONTEND_TAG="${DOCKER_REGISTRY}msit-frontend:latest"
        docker tag msit-frontend:latest "$FRONTEND_TAG"
        
        echo "Pushing frontend to $FRONTEND_TAG..."
        if docker push "$FRONTEND_TAG"; then
            print_success "Frontend pushed successfully"
        else
            print_error "Failed to push frontend"
        fi
    fi
fi

# Summary
print_section "Build Complete"
echo ""
docker images | grep msit
echo ""
print_success "Ready for deployment!"
echo ""
echo "Next steps:"
echo "  1. For local testing: $0 --test"
echo "  2. For Railway deployment: Push to GitHub (auto-detects Dockerfiles)"
echo "  3. For Docker Hub: $0 --push your-username"
echo ""
echo "For more info, see DOCKER_GUIDE.md"
