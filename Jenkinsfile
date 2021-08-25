def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger',
    'UNSTABLE': 'warning',
]

def createDockerEnvFileContent(String propertyFileName){
    configFileProvider([configFile(fileId: propertyFileName, variable: 'configFile')]) {
         def props = readProperties file: "$configFile"
         return "API_BASE_URL=" + props['API_BASE_URL'] + "\n" +
		 "TANAGURU_MODULES=" + props['TANAGURU_MODULES'] + "\n"
    }
}

pipeline {
    agent any
    stages {

		stage('Test') {
            agent {
                docker 'node'
            }
            steps {
				sh 'npm i'
				sh 'npm run test:unit'
            }
        }

        stage('Build') {
            agent {
                docker 'node'
            }
            steps {
				sh 'npm i'
                sh 'npm run build'
                sh 'tar -czvf tanaguru2020-webapp.tar.gz dist'
                sh '''
					WEBAPP_VERSION=$(npm run version --silent)
					echo ${WEBAPP_VERSION} > version.txt
				'''
                stash name: 'tanaguru2020-webapp', includes: 'tanaguru2020-webapp.tar.gz'
                stash name: 'version', includes: 'version.txt'
            }
        }

        stage('Build docker image') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'master'
                    branch 'beta'
                }
            }
            steps {
                git(url: "https://github.com/Tanaguru/tanaguru2020-docker", branch: "master", credentialsId: "github-rcharre")
                unstash 'tanaguru2020-webapp'
                unstash 'version'

                sh '''
					WEBAPP_VERSION=$(cat version.txt)
					mv tanaguru2020-webapp.tar.gz ./tanaguru2020-webapp/image/tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz
					docker build -t tanaguru2020-webapp:${WEBAPP_VERSION} \
						--build-arg TANAGURU_WEBAPP_ARCHIVE_PATH=tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz \
						./tanaguru2020-webapp/image/
        		'''
            }
        }

        stage('Deploy dev') {
            when {
                branch 'develop'
            }
            steps {
				script{
					unstash 'version'
					def devDockerEnv = createDockerEnvFileContent('62d1f7d7-fe7c-43da-a752-14fe989555bb');
                    writeFile file: "./.env", text: devDockerEnv
					def devPremiumDockerEnv = createDockerEnvFileContent('fd89a5e1-6720-4005-bbe5-a6ece32d5eaa');
                    writeFile file: "./.env-premium", text: devPremiumDockerEnv
					sh '''
						WEBAPP_VERSION=$(cat version.txt)
						docker stop tanaguru2020-webapp-dev || true
						docker image prune -f
						docker run -d --rm \
							--name tanaguru2020-webapp-dev \
							--env-file ./.env \
							--label "traefik.enable=true" \
							--label "traefik.frontend.redirect.entryPoint=secure" \
							--label "traefik.http.routers.tanaguru-webapp-dev.entrypoints=secure" \
							--label "traefik.http.routers.tanaguru-webapp-dev.rule=Host(\\`dev.tanaguru.com\\`)" \
							--label "traefik.http.routers.tanaguru-webapp-dev.tls=true" \
							--label "traefik.port=80" \
							--network=web \
							tanaguru2020-webapp:${WEBAPP_VERSION}
						docker stop tanaguru2020-webapp-premium-dev || true
						docker run -d --rm \
							--name tanaguru2020-webapp-premium-dev \
							--env-file ./.env-premium \
							--label "traefik.enable=true" \
							--label "traefik.frontend.redirect.entryPoint=secure" \
							--label "traefik.http.routers.tanaguru-webapp-premium-dev.entrypoints=secure" \
							--label "traefik.http.routers.tanaguru-webapp-premium-dev.rule=Host(\\`premium-dev.tanaguru.com\\`)" \
							--label "traefik.http.routers.tanaguru-webapp-premium-dev.tls=true" \
							--label "traefik.port=80" \
							--network=web \
							tanaguru2020-webapp:${WEBAPP_VERSION}
					'''
				}
            }
        }

        stage('Deploy prod') {
            when {
                branch 'master'
            }
            steps {
				script{
					unstash 'version'
					def prodDockerEnv = createDockerEnvFileContent('9389b3f2-3191-41af-82df-f08e2996df69');
					writeFile file: "./.env", text: prodDockerEnv
					def prodPremiumDockerEnv = createDockerEnvFileContent('2263c743-9725-4f1d-92c3-76865e2a9699');
					writeFile file: "./.env-premium", text: prodPremiumDockerEnv
					sh '''
						WEBAPP_VERSION=$(cat version.txt)

						docker stop tanaguru2020-webapp-prod || true
						docker image prune -f

						docker run -d --rm \
							--name tanaguru2020-webapp-prod \
							--env-file ./.env \
							--label "traefik.enable=true" \
							--label "traefik.frontend.redirect.entryPoint=secure" \
							--label "traefik.http.routers.tanaguru-webapp-prod.entrypoints=secure" \
							--label "traefik.http.routers.tanaguru-webapp-prod.rule=Host(\\`prod.tanaguru.com\\`)" \
							--label "traefik.http.routers.tanaguru-webapp-prod.tls=true" \
							--label "traefik.port=80" \
							--network=web \
							tanaguru2020-webapp:${WEBAPP_VERSION}

						docker stop tanaguru2020-webapp-premium-prod || true
						docker run -d --rm \
							--name tanaguru2020-webapp-premium-prod \
							--env-file ./.env-premium \
							--label "traefik.enable=true" \
							--label "traefik.frontend.redirect.entryPoint=secure" \
							--label "traefik.http.routers.tanaguru-webapp-premium-prod.entrypoints=secure" \
							--label "traefik.http.routers.tanaguru-webapp-premium-prod.rule=Host(\\`my.tanaguru.com\\`)" \
							--label "traefik.http.routers.tanaguru-webapp-premium-prod.tls=true" \
							--label "traefik.port=80" \
							--network=web \
							tanaguru2020-webapp:${WEBAPP_VERSION}
					'''
				}
			}
        }

        stage('Store packages') {
            when {
            	anyOf{
                	branch 'master'
                	branch 'beta'
                }
            }
            steps {
                unstash 'tanaguru2020-webapp'
                unstash 'version'

                sh '''
                	WEBAPP_VERSION=$(cat version.txt)
					DIR=/html/tanaguru2020-webapp/${WEBAPP_VERSION}
					if [ -d "$DIR" ]; then rm -Rf $DIR; fi
					mkdir -p $DIR
					mv -f tanaguru2020-webapp.tar.gz /html/tanaguru2020-webapp/${WEBAPP_VERSION}/tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz
                    chown 1000:1000 /html/tanaguru2020-webapp/${WEBAPP_VERSION}/tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz
                '''
            }
        }

        stage('Push beta image to registry') {
			when {
				branch 'beta'
			}
			steps {
				unstash 'version'

				script{
					def TIMESTAMP =sh(
						script: "date +%Y-%m-%d",
						returnStdout: true
					).trim()

					def WEBAPP_VERSION = sh(
						script: "cat version.txt",
						returnStdout: true
					).trim()

					def image = docker.image("tanaguru2020-webapp:${WEBAPP_VERSION}")
					docker.withRegistry('https://registry.tanaguru.com', 'registry') {
						image.push("beta-${TIMESTAMP}")
					}
				}
			}
		}

        stage('Push image to registry') {
			when {
				branch 'master'
			}
			steps {
				unstash 'version'

				script{
					def WEBAPP_VERSION = sh(
						script: "cat version.txt",
						returnStdout: true
					).trim()

					def image = docker.image("tanaguru2020-webapp:${WEBAPP_VERSION}")
					docker.withRegistry('https://registry.tanaguru.com', 'registry') {
						image.push()
						image.push('latest')
					}
				}
			}
		}
    }

    post {
        always {
            slackSend channel: '#jenkins',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\nMore info at: ${env.BUILD_URL}"
        }
    }
}
