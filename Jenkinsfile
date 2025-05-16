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
                echo "Building Docker image..."
                bat "docker build -t auto-infra-dashboard:${BUILD_NUMBER} ."
                echo "Docker image built successfully with tag: auto-infra-dashboard:${BUILD_NUMBER}"
            }
        }
        
        stage('Prepare for Container Run') {
            steps {
                echo "Stopping any existing container..."
                bat '''
                    echo Stopping any existing container...
                    docker stop auto-infra-container || echo Container not running
                '''
                
                echo "Removing any existing container..."
                bat '''
                    echo Removing any existing container...
                    docker rm auto-infra-container || echo No container to remove
                '''
            }
        }
        
        stage('Run Docker Container') {
            steps {
                echo "Starting new container..."
                bat """
                    echo Starting new container...
                    docker run -d -p 3001:3002 --name auto-infra-container auto-infra-dashboard:${BUILD_NUMBER}
                    echo Container started
                """
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo "Waiting for application to start..."
                bat "timeout /t 15"
                
                echo "Verifying container is running..."
                bat '''
                    docker ps | findstr auto-infra-container
                    if %errorlevel% neq 0 (
                        echo Container not running
                        exit /b 1
                    )
                    echo Container is running
                '''
                
                echo "Application deployed successfully at http://localhost:3001"
            }
        }
    }
    
    post {
        always {
            echo "Cleaning up..."
            bat '''
                echo Running cleanup...
                docker image prune -f || echo Cleanup failed but continuing
            '''
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}