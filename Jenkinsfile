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

  }
}