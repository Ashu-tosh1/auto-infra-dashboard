docker build -t auto-infra-dashboard .

# Auto Infra Dashboard - DevOps Deployment on EC2

A full-stack Next.js application deployed on an EC2 instance with Docker and CI/CD using Jenkins.

---

## 📦 Tech Stack

- **Frontend & Backend**: Next.js
- **Runtime**: Node.js via NVM
- **Containerization**: Docker
- **CI/CD**: Jenkins (with Jenkinsfile)
- **Version Control**: Git + GitHub
- **Server**: AWS EC2 (Ubuntu)

---

## 🛠️ 1. EC2 Instance Setup

1. Launch an EC2 instance (Ubuntu 22.04).
2. Create and download a key pair (`devops_project.pem`).
3. Update security group to allow:
   - Port `22` (SSH)
   - Port `8080` (Jenkins)
   - Port `3002` (Next.js app)

---

## 🔐 2. SSH Access via VS Code / Putty

### ✅ Using PuTTY:

1. Convert `devops_project.pem` to `.ppk` using **PuTTYgen**.
2. Use PuTTY to SSH into EC2 with:
   ```
   Host: <EC2-IP>
   Port: 22
   Auth > Private Key File: devops_project.ppk
   ```

### ✅ Using VS Code Remote SSH:

1. Install the **Remote - SSH** extension.
2. Add a new config in `.ssh/config`:
   ```ssh
   Host ec2-devops
     HostName <EC2-IP>
     User ubuntu
     IdentityFile ~/.ssh/devops_project.pem
   ```

---

## 🌐 3. Installing Node.js using NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
```

---

## 📥 4. Cloning the Repository

```bash
git clone https://github.com/<your-username>/auto-infra-dashboard.git
cd auto-infra-dashboard
```

---

## 🐳 5. Docker Setup & App Containerization

### Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV PORT=3002
EXPOSE 3002
CMD ["npm", "start"]
```

### Build and Run Docker Container

```bash
sudo usermod -aG docker $USER
newgrp docker

docker build -t auto-infra-dashboard .
docker run -d -p 3002:3002 --name auto-infra-app auto-infra-dashboard
```

Access your app via: `http://<EC2-IP>:3002`

---

## ⚙️ 6. Jenkins Installation & Setup

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee   /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]   https://pkg.jenkins.io/debian-stable binary/ | sudo tee   /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

Access Jenkins at: `http://<EC2-IP>:8080`

### Unlock Admin

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 🔁 7. CI/CD Pipeline using Jenkinsfile

### Jenkinsfile (in GitHub repo)

```groovy
pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/<your-username>/auto-infra-dashboard.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t auto-infra-dashboard .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                  docker rm -f auto-infra-app || true
                  docker run -d -p 3002:3002 --name auto-infra-app auto-infra-dashboard
                '''
            }
        }
    }
}
```

### Jenkins Setup Steps

1. Install Jenkins plugins: Git, Docker Pipeline, etc.
2. Create a new **Pipeline job**.
3. Point it to your GitHub repo.
4. Run build manually or set up GitHub webhook for auto-deploy.

---

## 🔍 Verification

- Visit `http://<EC2-IP>:3002` for app
- Visit `http://<EC2-IP>:8080` for Jenkins

---

## 🧹 Notes

- Always open required ports in EC2 security groups.
- To rebuild with changes:
  ```bash
  docker build -t auto-infra-dashboard .
  docker restart auto-infra-app
  ```
- For automatic deployment, configure GitHub Webhooks with your Jenkins URL.

---

## 🙌 You're Done!

This setup provides a real-world DevOps pipeline using GitHub, Jenkins, Docker, and an EC2 instance for production deployment.
