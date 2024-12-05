pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'todolist-manager'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub
                git 'https://github.com/yourusername/todolist-manager.git'
            }
        }

        stage('Build') {
            steps {
                // Build Docker image
                script {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Test') {
            steps {
                // Run tests (using Mocha or Jest)
                script {
                    sh 'npm test'
                }
            }
        }

        stage('Security Scan') {
            steps {
                // Run OWASP ZAP security scan
                script {
                    sh 'docker run --rm owasp/zap2docker-stable zap-full-scan.py -t http://localhost:3000'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Push Docker image to Docker Hub
                script {
                    sh 'docker tag $DOCKER_IMAGE yourdockerhubusername/todolist-manager:latest'
                    sh 'docker push yourdockerhubusername/todolist-manager:latest'
                }
            }
        }
    }
}
