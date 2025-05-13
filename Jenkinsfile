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
                // Your build commands here
                script {
                    sh 'docker build -t auto-infra-dashboard .'
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                // Your run commands here
                script {
                    sh 'docker run -d -p 8080:80 auto-infra-dashboard'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'  // Added || true to prevent failure if Docker isn't available
        }
    }
}