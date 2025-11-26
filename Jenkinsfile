pipeline {
	agent { 
		docker { 
			image 'node:20-bullseye' 
		} 
	}
	options { timestamps() }
	environment { CI = 'true' }

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
				catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
					sh 'npx ng test --watch=false --code-coverage --browsers=ChromeHeadless' 
				}
			}
			post {
				always {
					junit 'test-results/unit/junit.xml'

					publishCoverage(
						adapters: [lcovAdapter('coverage/**/lcov.info')],
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
					junit 'test-results/junit.xml' 
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
