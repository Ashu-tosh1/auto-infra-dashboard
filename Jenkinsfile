pipeline {
    agent any
    
    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repo...'
                git url: 'https://github.com/Ashu-tosh1/auto-infra-dashboard.git', branch: 'main'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image with a tag based on build number
                    bat "docker build -t auto-infra-dashboard:${env.BUILD_NUMBER} ."
                    echo "Docker image built successfully with tag: auto-infra-dashboard:${env.BUILD_NUMBER}"
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    // Stop and remove container if it exists
                    bat "docker stop auto-infra-container 2>nul || echo Container not running"
                    bat "docker rm auto-infra-container 2>nul || echo No container to remove"
                    
                    // Run the new container with the port mapping that matches your configuration
                    bat "docker run -d -p 3001:3002 --name auto-infra-container auto-infra-dashboard:${env.BUILD_NUMBER}"
                    echo "Container started successfully"
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    // Give the application a moment to start
                    bat "timeout /t 10"
                    
                    // Verify the container is running
                    bat "docker ps | findstr auto-infra-container"
                    
                    echo "Application deployed successfully at http://localhost:3001"
                }
            }
        }
    }
    
    post {
        always {
            echo "Cleaning up..."
            script {
                // Prune unused images to save disk space
                bat "docker image prune -f"
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}