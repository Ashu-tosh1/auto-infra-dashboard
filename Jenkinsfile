pipeline {
    agent any
    
    // Define constants directly instead of using environment variables
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
                powershell script: '''
                    $dockerImage = "auto-infra-dashboard"
                    $tag = "10"
                    
                    Write-Host "Building Docker image: $dockerImage`:$tag"
                    docker build -t "$dockerImage`:$tag" .
                    
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Docker build failed with exit code $LASTEXITCODE"
                        exit 1
                    }
                    
                    Write-Host "Docker image built successfully with tag: $dockerImage`:$tag"
                '''
            }
        }
        
        stage('Deploy Container') {
            steps {
                echo 'Deploying container...'
                powershell script: '''
                    $dockerImage = "auto-infra-dashboard"
                    $tag = "10"
                    $containerName = "auto-infra-container"
                    $port = "3001"
                    
                    Write-Host "Checking if port $port is in use..."
                    $portInUse = netstat -ano | findstr ":$port"
                    if ($portInUse) {
                        Write-Host "Port $port is in use. Attempting to find and remove conflicting containers..."
                        $containersUsingPort = docker ps -q --filter "publish=$port"
                        if ($containersUsingPort) {
                            Write-Host "Found containers using port $port. Stopping them..."
                            docker stop $containersUsingPort
                            docker rm $containersUsingPort
                        }
                    }
                    
                    Write-Host "Stopping and removing old container if it exists..."
                    docker stop $containerName 2>$null
                    docker rm $containerName 2>$null
                    
                    Write-Host "Starting new container..."
                    docker run -d --name $containerName -p "$port`:3000" "$dockerImage`:$tag"
                    
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Container deployment failed! Trying alternative port..."
                        $alternativePort = "3002"
                        Write-Host "Attempting to use port $alternativePort instead..."
                        docker run -d --name $containerName -p "$alternativePort`:3000" "$dockerImage`:$tag"
                        
                        if ($LASTEXITCODE -eq 0) {
                            Write-Host "Container successfully deployed on port $alternativePort!"
                        } else {
                            Write-Host "Container deployment failed on alternative port as well!"
                            exit 1
                        }
                    } else {
                        Write-Host "Container successfully deployed!"
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