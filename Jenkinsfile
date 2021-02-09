def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger',
    'UNSTABLE': 'warning',
]

def createDockerEnvFileContent(String propertyFileName){
    configFileProvider([configFile(fileId: propertyFileName, variable: 'configFile')]) {
         def props = readProperties file: "$configFile"
         return "API_BASE_URL=" + props['API_BASE_URL'] + "\n"
    }
}

pipeline {
    agent any
    stages {
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
					def devDockerEnv = createDockerEnvFileContent('812179c5-a3f7-4664-aa64-72e047016d28');
                    writeFile file: "./.env", text: devDockerEnv
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
				def devDockerEnv = createDockerEnvFileContent('9389b3f2-3191-41af-82df-f08e2996df69');
				writeFile file: "./.env", text: devDockerEnv
				sh '''
					WEBAPP_VERSION=$(cat version.txt)

					echo API_BASE_URL=https://prodapi.tanaguru.com > .env

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
				'''
			}
        }

        stage('Store packages') {
            when {
                branch 'master'
            }
            steps {
                unstash 'tanaguru2020-webapp'
                unstash 'version'

                sh '''
                    WEBAPP_VERSION=$(cat version.txt)
                    mkdir -p /html/tanaguru2020-webapp/${WEBAPP_VERSION}
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
						image.push('beta-${TIMESTAMP}')
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
