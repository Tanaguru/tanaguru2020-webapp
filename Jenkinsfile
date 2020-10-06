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
		stash name: 'webapp', includes: 'dist/*'
	  }
	}

	stage('TEST CICD') {
	  agent none
	  steps {
	  	dir("webapp") {
		  unstash "webapp"
	    }
		sh 'ls -la'
	  }
	}
  }
}
