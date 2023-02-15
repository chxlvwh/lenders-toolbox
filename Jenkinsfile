pipeline {
  agent any
  stages {
    stage('error') {
      steps {
        sh '''exit
cd /opt/lenders-toolbox
git pull
docker-compose build
docker-compose up'''
      }
    }

  }
}