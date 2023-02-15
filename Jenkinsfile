pipeline {
  agent any
  stages {
    stage('') {
      steps {
        sh '''cd /opt/lenders-toolbox
git pull
docker-compose build
docker-compose up'''
      }
    }

  }
}