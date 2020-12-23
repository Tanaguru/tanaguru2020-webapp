def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger',
    'UNSTABLE': 'warning',
]

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

        stage('Build alt') {
			when {
				branch 'refactoring-and-tests'
			}
			steps {
				git(url: "https://github.com/Tanaguru/tanaguru2020-docker", branch: "master", credentialsId: "github-rcharre")
				unstash 'tanaguru2020-webapp'
				unstash 'version'

				sh '''
					mv tanaguru2020-webapp.tar.gz ./tanaguru2020-webapp/image/tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz
				'''
				script{
					def WEBAPP_VERSION = sh(
						script: "\$(cat version.txt)",
						returnStdout: true
					)

					def image = docker.build("tanaguru2020-webapp:${WEBAPP_VERSION}",
						"--build-arg TANAGURU_WEBAPP_ARCHIVE_PATH=tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz ./tanaguru2020-webapp/image/")
				}
			}
		}

        stage('Deploy dev') {
            when {
                branch 'develop'
            }
            steps {
                unstash 'version'

                sh '''
					WEBAPP_VERSION=$(cat version.txt)

					echo API_BASE_URL=https://devapi.tanaguru.com > .env

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

        stage('Deploy prod') {
            when {
                branch 'master'
            }
            steps {
                unstash 'version'

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
			environment {
				REGISTRY_USER = "admin"
				REGISTRY_PASS = "9x^VTugHEfQ1e7"
				REGISTRY_HOST = "registry.tanaguru.com"
			}
			when {
				branch 'beta'
			}
			steps {
				unstash 'version'

				sh '''
				  TIMESTAMP=$(date +"%Y-%m-%d")
				  WEBAPP_VERSION=$(cat version.txt)

				  docker login \
				  --username="$REGISTRY_USER" \
				  --password="$REGISTRY_PASS" "$REGISTRY_HOST"

				  docker tag tanaguru2020-webapp:${WEBAPP_VERSION} registry.tanaguru.com/tanaguru2020-webapp:beta-$TIMESTAMP
				  docker push registry.tanaguru.com/tanaguru2020-webapp:beta-$TIMESTAMP
				'''
			}
		}

        stage('Push image to registry') {
        	environment {
				REGISTRY_USER = "admin"
				REGISTRY_PASS = "9x^VTugHEfQ1e7"
				REGISTRY_HOST = "registry.tanaguru.com"
			}
			when {
				branch 'master'
			}
			steps {
				unstash 'version'

				sh '''
				  WEBAPP_VERSION=$(cat version.txt)

				  docker login \
				  --username="$REGISTRY_USER" \
				  --password="$REGISTRY_PASS" "$REGISTRY_HOST"
				  docker tag tanaguru2020-webapp:${WEBAPP_VERSION} registry.tanaguru.com/tanaguru2020-webapp:${WEBAPP_VERSION}
				  docker push registry.tanaguru.com/tanaguru2020-webapp:${WEBAPP_VERSION}

				  docker tag tanaguru2020-webapp:${WEBAPP_VERSION} registry.tanaguru.com/tanaguru2020-webapp:latest
				  docker push registry.tanaguru.com/tanaguru2020-webapp:latest
				'''
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
