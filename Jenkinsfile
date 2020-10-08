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
        stash(name: 'dist', includes: 'dist/**/*')
      }
    }

    stage('TEST CICD') {
      steps {
        unstash 'dist'
        sh 'ls -la dist/'
      }
    }

    stage('Build docker image') {
      steps {
        git(url: 'https://github.com/Tanaguru/tanaguru2020-docker', branch: 'master', credentialsId: 'github-rcharre')
      }
    }

  }
}