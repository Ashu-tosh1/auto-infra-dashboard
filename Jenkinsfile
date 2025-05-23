pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "auto-infra-dashboard"
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

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                powershell script: '''
                    $dockerImage = "$env:DOCKER_IMAGE"
                    $tag = "$env:TAG"
                    
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

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    powershell script: '''
                        $dockerImage = "$env:DOCKER_IMAGE"
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

                        Write-Host "Tagging image for Docker Hub..."
                        docker tag "$dockerImage`:$tag" "$dockerHubRepo`:$tag"
                        
                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "Docker tag failed!"
                            exit 1
                        }

                        Write-Host "Pushing image to Docker Hub: $dockerHubRepo`:$tag"
                        docker push "$dockerHubRepo`:$tag"

                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "Docker push failed!"
                            exit 1
                        } else {
                            Write-Host "Image pushed successfully to Docker Hub!"
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
                    
                    Write-Host "Starting new container from Docker Hub image..."
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