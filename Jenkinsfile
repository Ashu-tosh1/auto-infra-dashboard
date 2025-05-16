pipeline {
    agent any
    
    tools {
        nodejs 'Node18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                bat 'npm run lint || exit 0'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    bat "docker build -t autoinfra-app:${env.BUILD_NUMBER} ."
                    bat "docker tag autoinfra-app:${env.BUILD_NUMBER} autoinfra-app:latest"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Stop and remove any existing container
                    bat '''
                    FOR /f "tokens=*" %%i IN ('docker ps -f name^=autoinfra -q') DO docker stop %%i
                    FOR /f "tokens=*" %%i IN ('docker ps -a -f name^=autoinfra -q') DO docker rm %%i
                    '''
                    
                    // Run the new container
                    bat "docker run -d -p 3001:3002 --name autoinfra-app-${env.BUILD_NUMBER} autoinfra-app:${env.BUILD_NUMBER}"
                }
            }
        }
    }
    
    post {
        always {
            // Clean up older images to save disk space
            bat 'docker image prune -f'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}