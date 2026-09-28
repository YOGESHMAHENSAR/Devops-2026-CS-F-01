pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'

                script {
                    try {
                        checkout scm
                        echo '✅ Checkout completed successfully.'
                    } catch (Exception e) {
                        echo '❌ ERROR: Checkout failed!'
                        echo "Error details: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing project dependencies...'

                script {
                    try {
                        if (isUnix()) {
                            sh 'npm ci'
                        } else {
                            bat 'npm ci'
                        }

                        echo '✅ Dependencies installed successfully.'

                    } catch (Exception e) {
                        echo '❌ ERROR: Dependency installation failed!'
                        echo "Error details: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Validate student.json Data & Form Rules') {
            steps {
                echo 'Starting automated test suite...'

                script {
                    try {
                        if (isUnix()) {
                            sh 'node test-runner.js'
                        } else {
                            bat 'node test-runner.js'
                        }

                        echo '✅ All test cases passed successfully.'

                    } catch (Exception e) {
                        echo '❌ ERROR: Test validation failed!'
                        echo "Error details: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }
    }

    post {

        success {
            echo '''
            ==========================================
            🎉 BUILD SUCCESSFUL
            ==========================================
            All student.json test cases passed.
            '''
        }

        failure {
            echo '''
            ==========================================
            🚨 BUILD FAILED
            ==========================================
            An error occurred during the pipeline.
            Check the stage above for the exact error.
            ==========================================
            '''
        }

        always {
            echo "Build result: ${currentBuild.currentResult}"
        }
    }
}