pipeline {
    agent {
        docker {
            image 'brainful-frontend-ci'
            args '-u 0:0'
        }
    }

    options {
        timestamps()
    }

    environment {
        CI = 'true'
        CHROME_BIN = '/usr/bin/chromium'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Unit Tests + Coverage') {
            steps {
                sh 'npx ng test --watch=false --code-coverage --browsers=ChromeHeadlessCI'
            }
        }

        stage('E2E (Playwright)') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npx playwright install-deps || true'
                    sh 'npm run e2e -- --reporter=junit'
                }
            }
            post {
                always {
                    junit testResults: 'test-results/e2e/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('SonarCloud') {
            steps {
                withSonarQubeEnv('SonarCloud') {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh 'sonar-scanner'
                    }
                }
            }
        }
    }

    post {
        always {
            junit testResults: 'test-results/unit/junit.xml', allowEmptyResults: true

            archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
    }
}
