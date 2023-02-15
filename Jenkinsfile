pipeline {
  agent any
  stages {
    stage('test') {
      steps {
        sh '''pwd
exit
cd /opt/lenders-toolbox
git pull
docker-compose build
docker-compose up'''
        sh '''cd /opt/lenders-toolbox
git pull
docker-compose build
docker-compose up'''
      }
    }

  }
}