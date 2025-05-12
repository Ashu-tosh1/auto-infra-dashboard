pipeline {
    agent any

    environment {
        IMAGE_NAME = "autoinfra-nextjs"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "auto-infra-container"
    }

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repo...'
                git 'https://github.com/Ashu-tosh1/auto-infra-dashboard.git'  // Cloning your GitHub repo
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'  // Build the Docker image
            }
        }
        stage('Run Docker Container') {
            steps {
                echo 'Running Docker container...'
                // Stop and remove any existing container
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d -p 3005:3001 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Optional: Clean up old Docker images and containers
            sh 'docker system prune -f'
        }
    }
}
