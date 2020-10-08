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
		sh 'tar -czvf tanaguru2020-webapp'
		stash name: 'tanaguru2020-webapp', includes: 'tanaguru2020-webapp.tar.gz'
	  }
	}

	stage('Build docker image') {
	  steps {
		git(url: 'https://github.com/Tanaguru/tanaguru2020-docker', branch: 'master', credentialsId: 'github-rcharre')
		unstash 'tanaguru2020-webapp'
		sh 'mv tanaguru2020-webapp.tar.gz ./tanaguru2020-docker/tanaguru2020-webapp/image'
		sh 'docker build -t tanaguru2020-webapp:$WEBAPP_VERSION ./tanaguru2020-docker/tanaguru2020-webapp/image/'
	  }
	}
  }
}
