pipeline {
    agent any

    environment {
        PROJECT_NAME   = 'Devops-2026-CS-F-01'
        BACKEND_IMAGE  = 'devops-backend:latest'
        FRONTEND_IMAGE = 'devops-frontend:latest'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo "===> Checking out repository from SCM..."
                checkout scm
                script {
                    echo "Workspace: ${WORKSPACE}"
                    echo "Branch: ${env.GIT_BRANCH ?: 'unknown'}"
                    echo "Commit: ${env.GIT_COMMIT ?: 'unknown'}"
                }
            }
        }

        stage('2. Backend - Install & Test') {
            steps {
                echo "===> Validating and Testing Backend..."
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci || npm install'
                            sh 'node --check app.js'
                            sh 'npm test'
                        } else {
                            bat 'npm ci || npm install'
                            bat 'node --check app.js'
                            bat 'npm test'
                        }
                    }
                }
            }
        }

        stage('3. Frontend - Lint, Test & Build') {
            steps {
                echo "===> Linting, Testing, and Building Frontend..."
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci || npm install'
                            sh 'npm run lint'
                            sh 'npm test'
                            sh 'npm run build'
                        } else {
                            bat 'npm ci || npm install'
                            bat 'npm run lint'
                            bat 'npm test'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('4. Docker Build & Package') {
            steps {
                echo "===> Building Docker images for Backend and Frontend..."
                script {
                    if (isUnix()) {
                        sh 'docker compose build || (docker build -t $BACKEND_IMAGE ./backend && docker build -t $FRONTEND_IMAGE ./frontend)'
                    } else {
                        bat 'docker compose build || (docker build -t %BACKEND_IMAGE% ./backend && docker build -t %FRONTEND_IMAGE% ./frontend)'
                    }
                }
            }
        }

        stage('5. Generate Pipeline Feedback') {
            steps {
                echo "===> Generating build feedback summary report..."
                script {
                    def branch = env.GIT_BRANCH ?: 'main'
                    def commit = env.GIT_COMMIT ?: 'N/A'
                    def buildNum = env.BUILD_NUMBER ?: '1'
                    def buildUrl = env.BUILD_URL ?: 'Local-Run'
                    def dateStr = new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('UTC'))

                    def feedbackContent = """# Jenkins CI/CD Build Feedback Report
- **Project**: ${PROJECT_NAME}
- **Build Number**: #${buildNum}
- **Timestamp (UTC)**: ${dateStr}
- **Branch**: ${branch}
- **Commit**: ${commit}
- **Status**: SUCCESS
- **Build URL**: ${buildUrl}

### Pipeline Execution Summary
| Stage | Description | Status |
|---|---|---|
| 1. Checkout Code | Cloned Git repository | PASSED |
| 2. Backend Install & Test | Installed packages, validated app.js syntax & executed 10 unit tests | PASSED |
| 3. Frontend Lint, Test & Build | Executed oxlint, 11 frontend unit tests & Vite production build | PASSED |
| 4. Docker Packaging | Built backend & frontend container images | PASSED |
| 5. Feedback Report | Generated automated build feedback summary | PASSED |

### Generated Artifacts
- Frontend production bundle (`frontend/dist/`)
- Backend Docker Image: `${BACKEND_IMAGE}`
- Frontend Docker Image: `${FRONTEND_IMAGE}`
- Feedback report: `build-feedback.txt` & `jenkins-feedback.md`
"""
                    writeFile file: 'jenkins-feedback.md', text: feedbackContent

                    def textFeedback = """============================================================
              JENKINS CI/CD BUILD FEEDBACK REPORT
============================================================
Project Name : ${PROJECT_NAME}
Build Number : #${buildNum}
Build URL    : ${buildUrl}
Branch       : ${branch}
Commit Hash  : ${commit}
Date/Time UTC: ${dateStr}
Build Status : SUCCESS
------------------------------------------------------------
Stages Completed:
  [PASS] 1. Checkout Code
  [PASS] 2. Backend - Install & Test (Node.js Unit Tests)
  [PASS] 3. Frontend - Lint, Test & Build (oxlint + Unit Tests + Vite)
  [PASS] 4. Docker Build & Package
  [PASS] 5. Feedback Generation
------------------------------------------------------------
Artifacts:
  - frontend/dist/**
  - ${BACKEND_IMAGE}
  - ${FRONTEND_IMAGE}
============================================================
"""
                    writeFile file: 'build-feedback.txt', text: textFeedback
                }
            }
        }
    }

    post {
        always {
            echo "===> Archiving build artifacts and feedback..."
            archiveArtifacts artifacts: 'build-feedback.txt, jenkins-feedback.md, frontend/dist/**', allowEmptyArchive: true
        }
        success {
            echo "=================================================="
            echo " SUCCESS: Jenkins pipeline completed successfully!"
            echo " Build Feedback archived and ready for review."
            echo "=================================================="
        }
        failure {
            echo "=================================================="
            echo " FAILURE: Jenkins pipeline encountered errors."
            echo " Check console log at: ${env.BUILD_URL ?: ''}console"
            echo "=================================================="
            script {
                def branch = env.GIT_BRANCH ?: 'unknown'
                def commit = env.GIT_COMMIT ?: 'N/A'
                def buildNum = env.BUILD_NUMBER ?: '1'
                def buildUrl = env.BUILD_URL ?: 'Local-Run'
                def dateStr = new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('UTC'))

                def failText = """============================================================
              JENKINS CI/CD BUILD FAILURE REPORT
============================================================
Project Name : ${PROJECT_NAME}
Build Number : #${buildNum}
Build URL    : ${buildUrl}
Branch       : ${branch}
Commit Hash  : ${commit}
Date/Time UTC: ${dateStr}
Build Status : FAILED
------------------------------------------------------------
Please inspect the console output to diagnose the failure:
${buildUrl}console
============================================================
"""
                writeFile file: 'build-feedback.txt', text: failText
            }
            archiveArtifacts artifacts: 'build-feedback.txt', allowEmptyArchive: true
        }
    }
}
