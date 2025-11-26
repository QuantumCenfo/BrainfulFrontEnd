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
                  apt-get update
                  apt-get install -y chromium
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
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npx ng test --watch=false --code-coverage --browsers=ChromeHeadlessCI'
                }
            }
            post {
                always {
                    junit testResults: 'test-results/unit/**/*.xml', allowEmptyResults: true

                    publishCoverage(
                        adapters: [
                            lcovAdapter('coverage/BrainfulFrontEnd/lcov.info')
                        ],
                        sourceFileResolver: sourceFiles('STORE_ALL_BUILD')
                    )
                }
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
}
