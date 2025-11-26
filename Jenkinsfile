pipeline {
	agent { 
		docker { 
			image 'node:20-bullseye' 
		} 
	}
	options { timestamps() }
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

		stage('Install system deps') {
            steps {
                sh '''
                  sudo apt-get update
                  sudo apt-get install -y \
                    chromium \
                    chromium-sandbox \
                    libnss3 \
                    libatk-bridge2.0-0 \
                    libgtk-3-0 \
                    libdrm2 \
                    libgbm1 \
                    libxkbcommon0 \
                    libasound2
                '''
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
					sh 'npx playwright install --with-deps'
					sh 'npm run e2e -- --reporter=junit'
				}
			}
			post { 
				always { 
					junit testResults: 'test-results/unit/junit.xml', allowEmptyResults: true
				}
			}
		}

		stage('SonarCloud') {
			steps {
				withSonarQubeEnv('SonarCloud') {
					catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
						sh 'npx sonar-scanner'
					}
				}
			}
		}
    }

    post {
        always {
            junit 'test-results/unit/junit.xml'
            archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
	}
}
