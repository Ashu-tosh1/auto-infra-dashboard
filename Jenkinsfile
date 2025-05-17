pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'auto-infra-dashboard'
        CONTAINER_NAME = 'auto-infra-container'
        TAG = '10'
        PORT = '3001'
    }
    
    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repo...'
                git url: 'https://github.com/Ashu-tosh1/auto-infra-dashboard.git', branch: 'main'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                powershell '''
                    docker build -t ${DOCKER_IMAGE}:${TAG} .
                '''
                echo "Docker image built successfully with tag: ${DOCKER_IMAGE}:${TAG}"
            }
        }
        
        stage('Deploy Container') {
            steps {
                echo 'Deploying container...'
                powershell '''
                    echo "Checking if port ${PORT} is in use..."
                    $portInUse = netstat -ano | findstr :${PORT}
                    if ($portInUse) {
                        echo "Port ${PORT} is in use. Attempting to find and remove conflicting containers..."
                        $containersUsingPort = docker ps -q --filter "publish=${PORT}"
                        if ($containersUsingPort) {
                            echo "Found containers using port ${PORT}. Stopping them..."
                            docker stop $containersUsingPort
                            docker rm $containersUsingPort
                        }
                    }
                    
                    echo "Stopping and removing old container if it exists..."
                    docker stop ${CONTAINER_NAME} 2>$null
                    docker rm ${CONTAINER_NAME} 2>$null
                    
                    echo "Starting new container..."
                    docker run -d --name ${CONTAINER_NAME} -p ${PORT}:3000 ${DOCKER_IMAGE}:${TAG}
                    
                    if ($LASTEXITCODE -ne 0) {
                        echo "Container deployment failed! Trying alternative port..."
                        $alternativePort = "3003"
                        echo "Attempting to use port $alternativePort instead..."
                        docker run -d --name ${CONTAINER_NAME} -p $alternativePort:3000 ${DOCKER_IMAGE}:${TAG}
                        
                        if ($LASTEXITCODE -eq 0) {
                            echo "Container successfully deployed on port $alternativePort!"
                        } else {
                            echo "Container deployment failed on alternative port as well!"
                            exit 1
                        }
                    } else {
                        echo "Container successfully deployed!"
                    }
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            powershell '''
                docker system prune -f
                echo "Cleanup completed."
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