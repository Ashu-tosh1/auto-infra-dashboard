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
                powershell "docker build -t auto-infra-dashboard:\${env:BUILD_NUMBER} ."
                echo "Docker image built successfully with tag: auto-infra-dashboard:${BUILD_NUMBER}"
            }
        }
        
        stage('Deploy Container') {
            steps {
                echo "Deploying container..."
                // Use powershell instead of batch to handle Docker commands more reliably
                powershell '''
                    # Stop container if running
                    if (docker ps -a --format "{{.Names}}" | Select-String -Pattern "auto-infra-container") {
                        Write-Host "Stopping existing container..."
                        docker stop auto-infra-container
                        docker rm auto-infra-container
                    } else {
                        Write-Host "No existing container found."
                    }
                    
                    # Run new container
                    Write-Host "Starting new container..."
                    docker run -d -p 3001:3002 --name auto-infra-container auto-infra-dashboard:$env:BUILD_NUMBER
                    
                    # Verify container is running
                    Start-Sleep -Seconds 5
                    $container = docker ps --filter "name=auto-infra-container" --format "{{.Names}}"
                    
                    if ($container -eq "auto-infra-container") {
                        Write-Host "Container successfully deployed!"
                    } else {
                        Write-Host "Container deployment failed!"
                        exit 1
                    }
                '''
                
                echo "Application deployed successfully at http://localhost:3001"
            }
        }
    }
    
    post {
        always {
            echo "Cleaning up..."
            powershell '''
                try {
                    docker image prune -f
                    Write-Host "Cleanup completed."
                } catch {
                    Write-Host "Cleanup failed but continuing."
                }
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