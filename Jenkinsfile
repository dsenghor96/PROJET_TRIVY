pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "dieys"
        BACKEND_IMAGE   = "${DOCKERHUB_USER}/portfolio-api:${BUILD_NUMBER}"
        FRONTEND_IMAGE  = "${DOCKERHUB_USER}/portfolio-react:${BUILD_NUMBER}"
        AWS_REGION      = "us-east-1"
        TF_DIR          = "terraform"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                        rm -rf .scannerwork

                        docker run --rm \
                        --network portfolio_perso_portfolio-network \
                        --volumes-from portfolio_jenkins \
                        -w "${WORKSPACE}" \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.host.url="$SONAR_HOST_URL" \
                        -Dsonar.login="$SONAR_AUTH_TOKEN" \
                        -Dsonar.projectKey=portfolio-mern \
                        -Dsonar.projectName='Portfolio MERN' \
                        -Dsonar.sources=api,ux_react/src \
                        -Dsonar.exclusions=**/node_modules/**,**/.git/**,**/dist/** \
                        -Dsonar.qualitygate.wait=true
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Backend') {
                    steps {
                        sh "docker build -t ${BACKEND_IMAGE} ./api"
                    }
                }
                stage('Frontend') {
                    steps {
                        sh "docker build -t ${FRONTEND_IMAGE} ./ux_react"
                    }
                }
            }
        }

        stage('Trivy Security Scan') {
            stages {
                stage('Trivy DB Update') {
                    steps {
                        sh '''
                            echo "=== Mise a jour de la base CVE Trivy (une seule fois) ==="
                            docker run --rm \
                              -v trivy-cache:/root/.cache/trivy \
                              aquasec/trivy image --download-db-only
                        '''
                    }
                }
                stage('Trivy Scans') {
                    parallel {
                        stage('Backend') {
                            steps {
                                sh '''
                                    echo "=== Trivy scan (table) - Backend ==="
                                    docker run --rm \
                                      -v /var/run/docker.sock:/var/run/docker.sock \
                                      -v trivy-cache:/root/.cache/trivy \
                                      aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 \
                                      --skip-db-update \
                                      "${BACKEND_IMAGE}"

                                    docker run --rm \
                                      -v /var/run/docker.sock:/var/run/docker.sock \
                                      -v trivy-cache:/root/.cache/trivy \
                                      --volumes-from portfolio_jenkins \
                                      -w "${WORKSPACE}" \
                                      aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 \
                                      --skip-db-update \
                                      --format json -o trivy-backend-report.json \
                                      "${BACKEND_IMAGE}"
                                '''
                                archiveArtifacts artifacts: 'trivy-backend-report.json', allowEmptyArchive: true
                            }
                        }
                        stage('Frontend') {
                            steps {
                                sh '''
                                    echo "=== Trivy scan (table) - Frontend ==="
                                    docker run --rm \
                                      -v /var/run/docker.sock:/var/run/docker.sock \
                                      -v trivy-cache:/root/.cache/trivy \
                                      aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 \
                                      --skip-db-update \
                                      "${FRONTEND_IMAGE}"

                                    docker run --rm \
                                      -v /var/run/docker.sock:/var/run/docker.sock \
                                      -v trivy-cache:/root/.cache/trivy \
                                      --volumes-from portfolio_jenkins \
                                      -w "${WORKSPACE}" \
                                      aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 \
                                      --skip-db-update \
                                      --format json -o trivy-frontend-report.json \
                                      "${FRONTEND_IMAGE}"
                                '''
                                archiveArtifacts artifacts: 'trivy-frontend-report.json', allowEmptyArchive: true
                            }
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push "$BACKEND_IMAGE"
                        docker push "$FRONTEND_IMAGE"

                        docker tag "$BACKEND_IMAGE" "${DOCKERHUB_USER}/portfolio-api:latest"
                        docker tag "$FRONTEND_IMAGE" "${DOCKERHUB_USER}/portfolio-react:latest"
                        docker push "${DOCKERHUB_USER}/portfolio-api:latest"
                        docker push "${DOCKERHUB_USER}/portfolio-react:latest"
                    '''
                }
            }
        }

        stage('Terraform Init') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        cd ${TF_DIR}
                        terraform init
                    '''
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        cd ${TF_DIR}
                        terraform plan
                    '''
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        cd ${TF_DIR}
                        terraform apply -auto-approve
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline execute avec succes - App MERN deployee sur EKS"

            emailext(
                subject: "Jenkins - Build #${BUILD_NUMBER} reussi",
                body: """
                    Bonjour Dieynaba,

                    Le pipeline ${JOB_NAME} a ete execute avec succes.

                    Details :
                    - Build  : #${BUILD_NUMBER}
                    - Branche: ${GIT_BRANCH}
                    - Commit : ${GIT_COMMIT}
                    - Duree  : ${currentBuild.durationString}

                    Logs : ${BUILD_URL}
                """,
                to: 'dsenghor96@gmail.com'
            )
        }

        failure {
            echo "Pipeline echoue. Verifie les logs Jenkins."

            emailext(
                subject: "Jenkins - Build #${BUILD_NUMBER} echoue",
                body: """
                    Bonjour Dieynaba,

                    Le pipeline ${JOB_NAME} a echoue.

                    Details :
                    - Build  : #${BUILD_NUMBER}
                    - Branche: ${GIT_BRANCH}
                    - Commit : ${GIT_COMMIT}

                    Logs : ${BUILD_URL}
                """,
                to: 'dsenghor96@gmail.com'
            )
        }

        always {
            sh "docker logout || true"
            echo "Deconnectee de DockerHub"
        }
    }
}
