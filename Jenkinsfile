pipeline {
  agent {
    docker {
      image 'node'
      args '-p 3000:3000'
    }

  }
  stages {


	stage('TEST CICD 3') {
	  steps {
		sh 'docker ps'
	  }
	}
  }
}
