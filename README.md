# Auto Infra Dashboard - DevOps Deployment on EC2

A full-stack Next.js application deployed on an EC2 instance with Docker and CI/CD using Jenkins.

---

# 🚀 Auto-Infra Dashboard

An automated infrastructure dashboard for real-time monitoring, planning, and DevOps pipeline visualization using modern technologies and containerized deployment.

---

## 📦 Tech Stack

| Layer              | Technology                         |
|--------------------|-------------------------------------|
| Frontend & Backend | **Next.js (Full-stack React)**      |
| Runtime            | **Node.js** (via NVM)               |
| Containerization   | **Docker**                          |
| Container Registry | **DockerHub**                       |
| CI/CD              | **Jenkins** (configured via Jenkinsfile) |
| Monitoring         | **Prometheus + Grafana**            |
| Version Control    | **Git + GitHub**                    |
| Hosting/Infra      | **AWS EC2 (Ubuntu 22.04 LTS)**      |

---

## 🚀 Port details
* **Frontend**: `3002`
* **Backend**: `3002`
* **API**: `3002/api`
* **Docker**: `3002:3002`
* **Jenkins**: `8080`
* **EC2**: `22` (SSH)
* **prometheus**: `9090` 
* **Grafana**: `3010` 


---

## 🛠️ 1. EC2 Instance Setup (AWS Free Tier)

Follow these steps to launch and configure a free-tier EC2 instance to host the Auto-Infra Dashboard:

### ✅ Step 1: Launch EC2 Instance

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Navigate to **EC2 Dashboard** → Click **Launch Instance**.
3. Configure instance:
   - **Name**: `devops-dashboard`
   - **AMI**: Ubuntu Server 22.04 LTS (Free Tier eligible)
   - **Instance Type**: `t2.micro` (Free Tier eligible)

---

### 🔑 Step 2: Create SSH Key Pair

1. In the **Key pair (login)** section:
   - Click **Create new key pair**
   - **Name**: `devops_project`
   - **Type**: RSA
   - **Format**: `.pem`
2. Download `devops_project.pem` and store it securely.

---

### 🔐 Step 3: Configure Security Group

Add the following **inbound rules** to your security group:

| Type        | Protocol | Port Range | Source        | Description            |
|-------------|----------|------------|----------------|------------------------|
| SSH         | TCP      | 22         | My IP          | For SSH access         |
| HTTP        | TCP      | 80         | Anywhere       | (Optional) Web Access  |
| Custom TCP  | TCP      | 3002-3002  | Anywhere       | Dashboard/Service Ports|

---

### 💾 Step 4: Storage Configuration

- **Volume**: 8 GiB (default gp2 SSD)
- This configuration is free-tier eligible.

---

### 🚀 Step 5: Launch & Connect

1. Click **Launch Instance**.
2. Once running, go to **Instances → Connect**.
3. Use the following command to SSH:

```bash
chmod 400 devops_project.pem
ssh -i "devops_project.pem" ubuntu@<your-ec2-public-ip>

---


## 🔐 2. SSH Access via Terminal & Running the Docker /screenshots/Image

1. **Open your terminal** and navigate to the directory where your key pair (`devops_project.pem`) is saved.

2. **Modify permissions** on the PEM file (if not already done):
   ```bash
   chmod 400 devops_project.pem
   ```

3. **SSH into your EC2 instance**:
   ```bash
   ssh -i devops_project.pem ubuntu@<your-ec2-public-ip>
   ```

4. **Ensure Docker is installed and running**:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   docker --version
   ```

5. **Pull the prebuilt Docker /screenshots/image from DockerHub**:
   ```bash
   docker pull ashutosh1201/auto-infra-dashboard:10
   ```

6. **Run the Docker container and expose it on port 3002**:
   ```bash
   docker run -d -p 3002:3002 --name auto-infra-dashboard ashutosh1201/auto-infra-dashboard:10
   ```

7. **Verify the container is running**:
   ```bash
   docker ps
   ```

8. **Access the dashboard** via your browser at:
   ```
   http://<your-ec2-public-ip>:3002
   ```


---

### Software Requirements
- **Node.js** (v18 or higher)
- **Docker Desktop** for Windows
- **Git** for Windows
- **Jenkins** (local installation)
- **Grafana** (local installation)
- **Prometheus** (local installation)

### Accounts Required
- GitHub account
- DockerHub account

---

## 💻 Local Development Setup

### Step 1: Create Next.js Dashboard
```bash
# Create new Next.js project
npx create-next-app@latest auto-infra-dashboard
cd auto-infra-dashboard

# Install additional dependencies
npm install axios recharts lucide-react

# Start development server
npm run dev
```

### Step 2: Develop Dashboard Features
Create your dashboard components with API integrations:
- Infrastructure monitoring widgets
- Real-time data visualization
- System metrics display
- Status indicators

### Step 3: Test Locally
```bash
# Run on development mode
npm run dev

# Access at: http://localhost:3000
```

---

## 📁 GitHub Repository Setup

### Step 1: Initialize Git Repository
```bash
# Initialize git in project directory
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Next.js dashboard setup"
```

### Step 2: Create GitHub Repository
1. Go to GitHub.com
2. Click "New Repository"
3. Name: `auto-infra-dashboard`
4. Make it public/private as needed
5. Don't initialize with README (already have local files)

### Step 3: Push to GitHub
```bash
# Add remote origin
git remote add origin https://github.com/<YOUR-USERNAME>/auto-infra-dashboard.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🐳 Docker Containerization

### Step 1: Create Dockerfile
Create `Dockerfile` in project root:

```dockerfile
# Stage 1: Build the Next.js app
# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

# Set the port to 3002
ENV PORT=3002

# Expose port 3002 to Docker
EXPOSE 3002

# Start the app
CMD ["npm", "start"]

```

### Step 2: Create .dockerignore
```bash
node_modules
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log
.nyc_output
.coverage
.env.local
```

### Step 3: Build and Test Docker /screenshots/Image
```bash
docker build -t auto-infra-dashboard .
docker run -d -p 3002:3002 --name auto-infra-app auto-infra-dashboard

# Access at: http://localhost:3002
```

---

## ⚙️ Jenkins CI/CD Pipeline

### Step 1: Install Jenkins on Windows

#### Option A: Download Jenkins WAR
```bash
java -jar jenkins.war --httpPort=8080
```

#### Option B: Install as Windows Service
Follow official instructions to install Jenkins as a service.

### Step 2: Initial Jenkins Setup
- Access: `http://localhost:8080`
- Admin password path: `C:\Users\{username}\.jenkins\secrets\initialAdminPassword`

### Step 3: Install Required Plugins
Install:
- Git Plugin
- Docker Pipeline Plugin
- GitHub Integration Plugin
- Pipeline Plugin
- NodeJS Plugin

### Step 4: Configure Global Tools
Configure Git and Node.js in Jenkins → Global Tool Configuration.

### Step 5: Create Jenkins Pipeline

#### Jenkinsfile:
```pipeline {
    agent any

    environment {
        DOCKER_/screenshots/IMAGE = "auto-infra-dashboard"
        TAG = "10"
        DOCKERHUB_REPO = "ashutosh1201/auto-infra-dashboard"
    }

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repo...'
                git url: 'https://github.com/Ashu-tosh1/auto-infra-dashboard.git', branch: 'main'
            }
        }

        stage('Build Docker /screenshots/Image') {
            steps {
                echo 'Building Docker /screenshots/image...'
                powershell script: '''
                    $docker/screenshots/Image = "$env:DOCKER_/screenshots/IMAGE"
                    $tag = "$env:TAG"
                    
                    Write-Host "Building Docker /screenshots/image: $docker/screenshots/Image`:$tag"
                    docker build -t "$docker/screenshots/Image`:$tag" .
                    
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Docker build failed with exit code $LASTEXITCODE"
                        exit 1
                    }
                    
                    Write-Host "Docker /screenshots/image built successfully with tag: $docker/screenshots/Image`:$tag"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Docker /screenshots/image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    powershell script: '''
                        $docker/screenshots/Image = "$env:DOCKER_/screenshots/IMAGE"
                        $tag = "$env:TAG"
                        $dockerHubRepo = "$env:DOCKERHUB_REPO"

                        Write-Host "Logging into Docker Hub as user: $env:DOCKER_USER"
                        
                        # Use docker login with explicit parameters
                        $loginResult = docker login -u "$env:DOCKER_USER" -p "$env:DOCKER_PASS" 2>&1
                        
                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "Docker login failed! Error: $loginResult"
                            Write-Host "Please check your Docker Hub credentials in Jenkins"
                            exit 1
                        }
                        
                        Write-Host "Docker login successful!"

                        Write-Host "Tagging /screenshots/image for Docker Hub..."
                        docker tag "$docker/screenshots/Image`:$tag" "$dockerHubRepo`:$tag"
                        
                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "Docker tag failed!"
                            exit 1
                        }

                        Write-Host "Pushing /screenshots/image to Docker Hub: $dockerHubRepo`:$tag"
                        docker push "$dockerHubRepo`:$tag"

                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "Docker push failed!"
                            exit 1
                        } else {
                            Write-Host "/screenshots/Image pushed successfully to Docker Hub!"
                        }
                        
                        # Logout for security
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying container...'
                powershell script: '''
                    $dockerHubRepo = "$env:DOCKERHUB_REPO"
                    $tag = "$env:TAG"
                    $containerName = "auto-infra-container"
                    $hostPort = "3002"
                    $containerPort = "3000"
                    
                    Write-Host "Checking if port $hostPort is in use..."
                    $portInUse = netstat -ano | findstr ":$hostPort"
                    if ($portInUse) {
                        Write-Host "Port $hostPort is in use. Attempting to find and remove conflicting containers..."
                        $containersUsingPort = docker ps -q --filter "publish=$hostPort"
                        if ($containersUsingPort) {
                            Write-Host "Found containers using port $hostPort. Stopping them..."
                            docker stop $containersUsingPort
                            docker rm $containersUsingPort
                        }
                    }
                    
                    Write-Host "Stopping and removing old container if it exists..."
                    docker stop $containerName 2>$null
                    docker rm $containerName 2>$null
                    
                    Write-Host "Starting new container from Docker Hub /screenshots/image..."
                    docker run -d --name $containerName -p "$hostPort`:$containerPort" "$dockerHubRepo`:$tag"
                    
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Container deployment failed!"
                        exit 1
                    } else {
                        Write-Host "Container successfully deployed on port $hostPort!"
                        Write-Host "Application should be accessible at http://localhost:$hostPort"
                    }
                '''
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            powershell script: '''
                Write-Host "Running cleanup..."
                docker system prune -f
                Write-Host "Cleanup completed."
            '''
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}
```

### Step 6: Jenkins Job
Use Pipeline script from SCM → Git → main → Jenkinsfile

---

## 🐋 DockerHub Integration

### Step 1: Create Account and Repo

### Step 2: Generate Access Token

### Step 3: Jenkins Credentials
Kind: `Username with password`, ID: `dockerhub-token`

### Step 4: Update Jenkinsfile

---

## 📊 Monitoring with Grafana & Prometheus

### Prometheus
Configure `prometheus.yml` and run Prometheus.



### Grafana
Run and access at `http://localhost:3010`

- Add Prometheus as a Data Source
- Import dashboard ID `1860`
- Create panels for system and app metrics

## 🙌 You're Done!

This setup provides a real-world DevOps pipeline using GitHub, Jenkins, Docker, and an EC2 instance for production deployment.

---

## 📸 8. Screenshots

### 🔧 Jenkins CI/CD Pipeline

> Jenkins automatically pulls code from GitHub, builds a Docker /screenshots/image, and runs your Next.js app inside a container.

![Jenkins CI/CD Pipeline](![alt text](/screenshots/image-2.png)) <sub>*Fig 1. Jenkins running multi-stage CI/CD pipeline for Auto Infra Dashboard*</sub>

---

### 🌐 EC2 and  Security Group Rules

> Ensuring open ports for SSH, Jenkins, and the app.

![EC2 Security Groups](![alt text](/screenshots/image-4.png)) <sub>*Fig 2. EC2 instance security group allowing ports 22, 8080, and 3002*</sub>

---


### 💻 Live App on EC2 (Port 3002)

> The dashboard is successfully running inside a Docker container on EC2.
![alt text](/screenshots/image-1.png)
![Auto Infra Dashboard UI](![alt text](/screenshots/image.png)) <sub>*Fig 3. Accessible Next.js App deployed via Docker on EC2*</sub>

---
### 💻 DockerHub 

> The repositry is successfully executed and Docker /screenshots/image is stored.
![alt text](/screenshots/image-1.png)
![Auto Infra Dashboard UI](![alt text](/screenshots/image-5.png)) <sub>*Fig 4.DockerHUB*</sub>

---

### 📦Locally running Docker 


![Docker Running Container](![alt text](/screenshots/image-6.png)) <sub>*Fig 5.Local  Docker Container for `auto-infra-dashboard` running on port 3002*</sub>

---


### 📦 Docker Container List

> Validating containerized deployment.
Docker pull 
``` docker pull ashutosh1201/auto-infra-dashboard:10```

Container run
``` docker run -d -p 3002:3002 --name auto-infra-dashboard ashutosh1201/auto-infra-dashboard:10 ```

```bash
docker ps
```

![Docker Running Container](![alt text](/screenshots/image-3.png)) <sub>*Fig 6. Docker container for `auto-infra-dashboard` running on port 3002*</sub>

---

![alt text](/screenshots/grafana1.png)
![alt text](/screenshots/cadvisor.png)
![alt text](/screenshots/cadvisor2.png)
![alt text](/screenshots/cadvisor3.png)
![alt text](/screenshots/cadvisor4.png)
![alt text](/screenshots/prometheus.png)



<!-- ### ⚙️ Jenkins Configuration

> Setting up the Jenkins pipeline and defining GitHub repo integration.

![Jenkins Job Config](https://user-/screenshots/images.githubusercontent.com/your-username/jenkins-job-config.png) <sub>*Fig 4. Jenkins job configured to auto-deploy from GitHub repository*</sub>

--- -->

<!-- ### 🌐 EC2 Security Group Rules

> Ensuring open ports for SSH, Jenkins, and the app.

![EC2 Security Groups](https://user-/screenshots/images.githubusercontent.com/your-username/ec2-security-group.png) <sub>*Fig 5. EC2 instance security group allowing ports 22, 8080, and 3002*</sub>

--- -->

<!-- 
### 📂 GitHub Webhook (Optional)

> GitHub can automatically trigger Jenkins builds on code push.

![GitHub Webhook](https://user-/screenshots/images.githubusercontent.com/your-username/github-webhook.png) <sub>*Fig 6. GitHub Webhook triggering Jenkins build on code changes*</sub>

--- -->

