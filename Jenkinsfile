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
                    // Using Docker Pipeline plugin syntax
                    docker.build("auto-infra-dashboard:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    // Using Docker Pipeline plugin syntax
                    docker.image("auto-infra-dashboard:${env.BUILD_ID}")
                          .run('-d -p 8080:80 --name auto-infra-container')
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            script {
                try {
                    // Using Docker Pipeline plugin syntax
                    sh 'docker system prune -f'
                } catch (Exception e) {
                    echo "Docker cleanup failed, but continuing: ${e.message}"
                }
            }
        }
    }
}