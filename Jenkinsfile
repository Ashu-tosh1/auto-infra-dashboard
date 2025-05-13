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
                    docker.build("auto-infra-dashboard")
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    docker.image("auto-infra-dashboard").run("-p 8080:80")
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'
        }
    }
}