pipeline {
  agent any
  stages {
	stage('BUILD') {
	  agent {
	  	docker 'node'
	  }
	  steps {
		sh 'npm i'
		sh 'npm run build'
		stash name: 'dist', includes: 'dist/*'
	  }
	}

	stage('TEST CICD') {
	  agent none
	  steps {
	  	unstash "dist"
		sh 'ls -la dist/'
	  }
	}
  }
}
