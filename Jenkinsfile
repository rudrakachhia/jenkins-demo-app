pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
    }

    // Poll the repo every 2 minutes for new commits (works without a public webhook URL).
    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME     = 'jenkins-demo-app'
        CONTAINER_NAME = 'jenkins-demo-app'
        HOST_PORT      = '8081'   // 8080 is used by Jenkins itself
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Builds only the "test" stage of the Dockerfile (npm ci + npm test).
        // If any test fails, this stage fails and the pipeline stops.
        stage('Build & Test') {
            steps {
                sh 'docker build --target test -t ${IMAGE_NAME}-test:${BUILD_NUMBER} .'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:3000 ${IMAGE_NAME}:latest
                    sleep 3
                    docker exec ${CONTAINER_NAME} wget -qO- http://localhost:3000/health
                '''
            }
        }
    }

    post {
        success { echo "Deployed! App running on port ${HOST_PORT}" }
        failure { echo 'Pipeline failed - check the stage logs above.' }
        always  { sh 'docker image prune -f || true' }
    }
}
