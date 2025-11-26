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

        stage('Unit Tests + Coverage') {
             steps {
                sh 'npm ci'
                sh 'npx ng test --watch=false --code-coverage --browsers=ChromeHeadlessCI'
            }
            post {
                always {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        junit 'test-results/unit/junit.xml'
                    }

                    recordCoverage(
                        tools: [[parser: 'COBERTURA', pattern: 'coverage/**/cobertura-coverage.info']],
                        sourceCodeRetention: 'NEVER',
                        failOnError: false
                    )
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
            archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
    }
}
