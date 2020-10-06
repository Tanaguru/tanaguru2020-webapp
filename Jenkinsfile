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
	  }
	}

	stage('TEST CICD') {
	  agent none
	  steps {
		sh 'ls -la'
	  }
	}
  }
}
