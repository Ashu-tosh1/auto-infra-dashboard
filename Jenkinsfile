pipeline {
    agent any
    
    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repo...'
                git branch: 'main', url: 'https://github.com/Ashu-tosh1/auto-infra-dashboard.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Using Docker Pipeline plugin syntax with better error handling
                    try {
                        docker.build("auto-infra-dashboard:${env.BUILD_ID}")
                        echo "Docker image built successfully with tag: auto-infra-dashboard:${env.BUILD_ID}"
                    } catch (Exception e) {
                        error "Failed to build Docker image: ${e.message}"
                    }
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh 'docker ps -q --filter name=auto-infra-container | grep -q . && docker stop auto-infra-container && docker rm auto-infra-container || echo "No existing container to remove"'
                    
                    // Using Docker Pipeline plugin syntax with better error handling
                    try {
                        docker.image("auto-infra-dashboard:${env.BUILD_ID}")
                              .run('-d -p 8080:80 --name auto-infra-container')
                        echo "Docker container started successfully on port 8080"
                    } catch (Exception e) {
                        error "Failed to run Docker container: ${e.message}"
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    // Wait for container to start and verify it's running
                    sleep 5
                    sh 'docker ps | grep auto-infra-container'
                    echo "Deployment verification complete. Container is running."
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            script {
                try {
                    // Only prune untagged/dangling images to avoid removing current image
                    sh 'docker image prune -f'
                } catch (Exception e) {
                    echo "Docker cleanup failed, but continuing: ${e.message}"
                }
            }
        }
        success {
            echo "Pipeline executed successfully! Access your application at http://localhost:8080"
        }
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}