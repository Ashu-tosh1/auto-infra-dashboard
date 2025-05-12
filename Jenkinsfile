pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repo...'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t autoinfra-nextjs:latest .'
            }
        }
        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 3005:3001 autoinfra-nextjs:latest'
            }
        }
    }
}
