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
	  steps {
		git(url: 'https://github.com/Tanaguru/tanaguru2020-docker', branch: 'master', credentialsId: 'github-rcharre')
		unstash 'tanaguru2020-webapp'
		unstash 'version'
		sh '''
			WEBAPP_VERSION=$(cat version.txt)
			mv tanaguru2020-webapp.tar.gz ./tanaguru2020-webapp/image/tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz
			docker build -t tanaguru2020-webapp:dev --build-arg TANAGURU_WEBAPP_ARCHIVE_PATH=tanaguru2020-webapp-${WEBAPP_VERSION}.tar.gz ./tanaguru2020-webapp/image/
		'''
		sh 'docker image prune -f'
	  }
	}
  }
}
