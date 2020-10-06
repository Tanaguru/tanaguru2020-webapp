pipeline {
  agent {
    docker {
      image 'node'
      args '-p 3000:3000'
    }

  }
  stages {
    stage('Prepare') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('TEST CICD 1') {
      when {
      	branch 'develop'
      }
	  steps {
		sh 'echo test develop'
	  }
	}

	stage('TEST CICD 1') {
	  when {
		branch 'CICD'
	  }
	  steps {
		sh 'echo test CICD'
	  }
	}

	stage('TEST CICD 1') {
	  steps {
		sh 'echo test'
	  }
	}
  }
}
