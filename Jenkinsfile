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
                    branch 'CICD'
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
                branch 'CICD'
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
                unstash 'tanaguru2020-webapp'
                unstash 'version'

                sh 'docker image prune -f'
            }
        }
    }
}
