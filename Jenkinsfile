pipeline {
    agent any

    parameters {
        choice(
            name: 'BUILD_TYPE',
            choices: ['development', 'staging', 'production'],
            description: 'Select the build type'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
        booleanParam(
            name: 'SKIP_SECURITY_SCANS',
            defaultValue: false,
            description: 'Skip security scans (for faster builds)'
        )
        string(
            name: 'CUSTOM_TAG',
            defaultValue: '',
            description: 'Custom tag for Docker image (optional)'
        )
    }

    tools {
        jdk 'jdk21'
        nodejs 'node24'
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            daysToKeepStr: '30',
            artifactNumToKeepStr: '5'
        ))
        timeout(time: 45, unit: 'MINUTES')
        retry(1)
        skipDefaultCheckout()
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        APP_NAME = 'mern-fit-verse'
        RELEASE = '1.0.0'
        DOCKER_USER = 'xjohnfit'
        DOCKER_CREDENTIAL_ID = 'dockerhub'
        SONARQUBE_CREDENTIAL_ID = 'sonarqube-token'
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${params.CUSTOM_TAG ?: "${RELEASE}-${BUILD_NUMBER}"}"
        NODE_ENV = "${params.BUILD_TYPE}"
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'

        // Cache keys for better dependency management
        ROOT_CACHE_KEY = "npm-root-${env.JOB_NAME}-${hashFiles('package-lock.json')}"
        FRONTEND_CACHE_KEY = "npm-frontend-${env.JOB_NAME}-${hashFiles('frontend/package-lock.json')}"
    }

    stages {
        stage('1. Setup') {
            parallel {
                stage('Clean Workspace') {
                    steps {
                        cleanWs()
                        echo '🧹 Workspace cleaned successfully'
                    }
                }
                stage('Environment Info') {
                    steps {
                        script {
                            echo """
                            🚀 Build Information:
                            - Build Type: ${params.BUILD_TYPE}
                            - Skip Tests: ${params.SKIP_TESTS}
                            - Skip Security Scans: ${params.SKIP_SECURITY_SCANS}
                            - Image Tag: ${IMAGE_TAG}
                            - Node Environment: ${NODE_ENV}
                            """
                        }
                    }
                }
            }
        }

        stage('2. Checkout from Git') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/xjohnfit/mern-fit-verse.git',
                        credentialsId: 'github'
                    ]],
                    extensions: [
                        [$class: 'CleanBeforeCheckout'],
                        [$class: 'CloneOption', depth: 1, noTags: false, reference: '', shallow: true]
                    ]
                ])
                echo '✅ Code checkout completed'
            }
        }

        stage('3. Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        script {
                            cache(maxCacheSize: 250, caches: [
                                cacheEntry(path: './node_modules', key: "${ROOT_CACHE_KEY}")
                            ]) {
                                sh '''
                                    echo "📦 Installing backend dependencies..."
                                    npm ci --prefer-offline --no-audit
                                    echo "✅ Backend dependencies installed"
                                '''
                            }
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            script {
                                cache(maxCacheSize: 250, caches: [
                                    cacheEntry(path: './node_modules', key: "${FRONTEND_CACHE_KEY}")
                                ]) {
                                    sh '''
                                        echo "📦 Installing frontend dependencies..."
                                        npm ci --prefer-offline --no-audit
                                        echo "✅ Frontend dependencies installed"
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('4. Code Quality Checks') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        script {
                            try {
                                sh '''
                                    echo "🔍 Linting backend code..."
                                    # Add backend linting if available
                                    echo "Backend linting completed (add ESLint config for backend if needed)"
                                '''
                            } catch (Exception e) {
                                echo "⚠️ Backend linting failed: ${e.getMessage()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            script {
                                try {
                                    sh '''
                                        echo "🔍 Linting frontend code..."
                                        npm run lint
                                        echo "✅ Frontend linting passed"
                                    '''
                                } catch (Exception e) {
                                    echo "⚠️ Frontend linting failed: ${e.getMessage()}"
                                    currentBuild.result = 'UNSTABLE'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('5. Build & Test') {
            parallel {
                stage('Backend Build & Test') {
                    steps {
                        script {
                            try {
                                sh '''
                                    echo "🔨 Building backend..."
                                    npm run build
                                    echo "✅ Backend build completed"
                                '''

                                if (!params.SKIP_TESTS) {
                                    sh '''
                                        echo "🧪 Running backend tests..."
                                        # Add backend test command when available
                                        # npm run test:backend -- --coverage --coverageReporters=lcov
                                        echo "Backend tests completed (add test script to package.json)"
                                    '''
                                }
                            } catch (Exception e) {
                                echo "❌ Backend build/test failed: ${e.getMessage()}"
                                throw e
                            }
                        }
                    }
                }
                stage('Frontend Build & Test') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            script {
                                try {
                                    if (!params.SKIP_TESTS) {
                                        sh '''
                                            echo "🧪 Running frontend tests..."
                                            # Add frontend test command when available
                                            # npm run test -- --coverage --coverageReporters=lcov --watchAll=false
                                            echo "Frontend tests completed (add test script to package.json)"
                                        '''
                                    }

                                    sh '''
                                        echo "🔨 Building frontend..."
                                        npm run build
                                        echo "✅ Frontend build completed"
                                    '''
                                } catch (Exception e) {
                                    echo "❌ Frontend build/test failed: ${e.getMessage()}"
                                    throw e
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('6. SonarQube Analysis') {
            when {
                not { params.SKIP_SECURITY_SCANS }
            }
            steps {
                script {
                    try {
                        withSonarQubeEnv('sonarqube-server') {
                            sh '''
                                echo "📊 Running SonarQube analysis..."
                                $SCANNER_HOME/bin/sonar-scanner \
                                -Dsonar.projectKey=FitVerse \
                                -Dsonar.projectName=FitVerse \
                                -Dsonar.projectVersion=${RELEASE} \
                                -Dsonar.sources=./backend,./frontend/src \
                                -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.ts,**/*.test.tsx \
                                -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info,frontend/coverage/lcov.info \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info,frontend/coverage/lcov.info \
                                -Dsonar.sourceEncoding=UTF-8
                            '''
                        }
                        echo '✅ SonarQube analysis completed'
                    } catch (Exception e) {
                        echo "⚠️ SonarQube analysis failed: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('7. Quality Gate') {
            when {
                not { params.SKIP_SECURITY_SCANS }
            }
            steps {
                script {
                    try {
                        timeout(time: 5, unit: 'MINUTES') {
                            def qualityGate = waitForQualityGate abortPipeline: false, credentialsId: "${SONARQUBE_CREDENTIAL_ID}"
                            echo "📋 SonarQube Quality Gate: ${qualityGate.status}"

                            if (qualityGate.status != 'OK') {
                                echo "⚠️ Quality gate failed: ${qualityGate.status}"
                                if (params.BUILD_TYPE == 'production') {
                                    error('Quality gate failed for production build')
                                } else {
                                    currentBuild.result = 'UNSTABLE'
                                }
                            }
                        }
                    } catch (Exception e) {
                        echo "⚠️ Quality Gate check failed: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('8. Security Scans') {
            when {
                not { params.SKIP_SECURITY_SCANS }
            }
            parallel {
                stage('OWASP Dependency Check') {
                    steps {
                        script {
                            try {
                                echo '🔒 Running OWASP Dependency Check...'
                                dependencyCheck additionalArguments: '''
                                    --scan ./
                                    --disableYarnAudit
                                    --disableNodeAudit
                                    --format ALL
                                    --suppression owasp-suppressions.xml
                                ''', odcInstallation: 'dp-check'

                                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                                echo '✅ OWASP Dependency Check completed'
                            } catch (Exception e) {
                                echo "⚠️ OWASP Dependency Check failed: ${e.getMessage()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: '**/dependency-check-report.*', allowEmptyArchive: true
                        }
                    }
                }
                stage('Trivy File System Scan') {
                    steps {
                        script {
                            try {
                                sh '''
                                    echo "🔍 Running Trivy file system scan..."
                                    trivy fs . \
                                        --no-progress \
                                        --format table \
                                        --severity HIGH,CRITICAL \
                                        --exit-code 0 \
                                        --output trivy-fs.txt

                                    # Also generate JSON format for parsing
                                    trivy fs . \
                                        --no-progress \
                                        --format json \
                                        --severity HIGH,CRITICAL \
                                        --exit-code 0 \
                                        --output trivy-fs.json
                                '''
                                echo '✅ Trivy file system scan completed'
                            } catch (Exception e) {
                                echo "⚠️ Trivy file system scan failed: ${e.getMessage()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'trivy-fs.*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('9. Docker Build & Push') {
            steps {
                script {
                    try {
                        echo '🐳 Building Docker image...'

                        // Build the Docker image with build args
                        def dockerImage = docker.build(
                            "${IMAGE_NAME}:${IMAGE_TAG}",
                            "--build-arg NODE_ENV=${NODE_ENV} --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') --build-arg VCS_REF=\$(git rev-parse --short HEAD) ."
                        )

                        // Push to registry
                        docker.withRegistry('', "${DOCKER_CREDENTIAL_ID}") {
                            dockerImage.push()

                            // Also push latest tag for non-production builds
                            if (params.BUILD_TYPE != 'production') {
                                dockerImage.push('latest')
                            }

                            // Push environment-specific tag
                            dockerImage.push("${params.BUILD_TYPE}")
                        }

                        echo '✅ Docker image built and pushed successfully'
                        echo "📦 Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                    } catch (Exception e) {
                        echo "❌ Docker build/push failed: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('10. Image Security & Health Checks') {
            parallel {
                stage('Trivy Image Scan') {
                    when {
                        not { params.SKIP_SECURITY_SCANS }
                    }
                    steps {
                        script {
                            try {
                                sh """
                                    echo "🔍 Scanning Docker image for vulnerabilities..."
                                    trivy image ${IMAGE_NAME}:${IMAGE_TAG} \
                                        --no-progress \
                                        --scanners vuln \
                                        --severity HIGH,CRITICAL \
                                        --format table \
                                        --exit-code 0 \
                                        --output trivy-image.txt

                                    # Also generate JSON format
                                    trivy image ${IMAGE_NAME}:${IMAGE_TAG} \
                                        --no-progress \
                                        --scanners vuln \
                                        --severity HIGH,CRITICAL \
                                        --format json \
                                        --exit-code 0 \
                                        --output trivy-image.json
                                """
                                echo '✅ Image security scan completed'
                            } catch (Exception e) {
                                echo "⚠️ Image security scan failed: ${e.getMessage()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'trivy-image.*', allowEmptyArchive: true
                        }
                    }
                }
                stage('Container Health Check') {
                    steps {
                        script {
                            try {
                                sh """
                                    echo "🏥 Testing container health..."

                                    # Run container in detached mode
                                    CONTAINER_ID=\$(docker run -d -p 5003:5003 --name test-container-${BUILD_NUMBER} ${IMAGE_NAME}:${IMAGE_TAG})

                                    # Wait for container to start
                                    sleep 10

                                    # Check if container is running
                                    if docker ps | grep -q test-container-${BUILD_NUMBER}; then
                                        echo "✅ Container started successfully"

                        # Test health endpoint (add this to your backend)
                        # curl -f http://localhost:5003/api/health || echo "Health check endpoint not available"                                        # Check container logs for any immediate errors
                                        docker logs test-container-${BUILD_NUMBER}
                                    else
                                        echo "❌ Container failed to start"
                                        docker logs test-container-${BUILD_NUMBER}
                                        exit 1
                                    fi

                                    # Cleanup test container
                                    docker stop test-container-${BUILD_NUMBER} || true
                                    docker rm test-container-${BUILD_NUMBER} || true
                                """
                                echo '✅ Container health check passed'
                            } catch (Exception e) {
                                echo "⚠️ Container health check failed: ${e.getMessage()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }
            }
        }

        stage('11. Cleanup & Finalize') {
            steps {
                script {
                    try {
                        sh '''
                            echo "🧹 Cleaning up Docker resources..."

                            # Remove test containers
                            docker rm -f test-container-${BUILD_NUMBER} || true

                            # Clean up old images (keep last 3 builds)
                            docker images ${IMAGE_NAME} --format "table {{.Repository}}:{{.Tag}}" | grep -v latest | tail -n +4 | xargs -r docker rmi || true

                            # Clean up build cache and unused resources
                            docker builder prune -f --filter until=24h || true
                            docker system prune -f --filter until=24h || true
                        '''
                        echo '✅ Cleanup completed'
                    } catch (Exception e) {
                        echo "⚠️ Cleanup failed: ${e.getMessage()}"
                    // Don't fail the build for cleanup issues
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Archive important artifacts
                archiveArtifacts artifacts: '''
                    trivy-*.txt,
                    trivy-*.json,
                    dependency-check-report.*,
                    frontend/dist/**,
                    dist/**
                ''', allowEmptyArchive: true

                // Calculate build duration
                def buildDuration = currentBuild.durationString.replace(' and counting', '')
                def buildResult = currentBuild.result ?: 'SUCCESS'
                def buildStatus = buildResult == 'SUCCESS' ? '✅' : buildResult == 'UNSTABLE' ? '⚠️' : '❌'

                // Send detailed notification
                emailext(
                    to: 'xjohnfitcodes@gmail.com',
                    subject: "${buildStatus} FitVerse Build #${BUILD_NUMBER}: ${buildResult}",
                    body: """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                .header { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
                                .success { color: #28a745; }
                                .warning { color: #ffc107; }
                                .failure { color: #dc3545; }
                                .info-table { border-collapse: collapse; width: 100%; margin-top: 15px; }
                                .info-table th, .info-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                .info-table th { background-color: #f2f2f2; }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <h2>${buildStatus} MERN FitVerse CI/CD Pipeline Report</h2>
                            </div>

                            <table class="info-table">
                                <tr><th>Project</th><td>${env.JOB_NAME}</td></tr>
                                <tr><th>Build Number</th><td>#${env.BUILD_NUMBER}</td></tr>
                                <tr><th>Status</th><td class="${buildResult.toLowerCase()}">${buildResult}</td></tr>
                                <tr><th>Duration</th><td>${buildDuration}</td></tr>
                                <tr><th>Build Type</th><td>${params.BUILD_TYPE}</td></tr>
                                <tr><th>Docker Image</th><td>${IMAGE_NAME}:${IMAGE_TAG}</td></tr>
                                <tr><th>Git Commit</th><td>${env.GIT_COMMIT?.take(8) ?: 'N/A'}</td></tr>
                                <tr><th>Build URL</th><td><a href="${BUILD_URL}">View Build Details</a></td></tr>
                            </table>

                            <h3>📊 Build Configuration:</h3>
                            <ul>
                                <li><strong>Skip Tests:</strong> ${params.SKIP_TESTS}</li>
                                <li><strong>Skip Security Scans:</strong> ${params.SKIP_SECURITY_SCANS}</li>
                                <li><strong>Custom Tag:</strong> ${params.CUSTOM_TAG ?: 'None'}</li>
                            </ul>

                            <h3>📋 Reports & Artifacts:</h3>
                            <ul>
                                <li><a href="${BUILD_URL}artifact/trivy-fs.txt">📄 Trivy File System Report</a></li>
                                <li><a href="${BUILD_URL}artifact/trivy-image.txt">🐳 Trivy Docker Image Report</a></li>
                                <li><a href="${BUILD_URL}artifact/dependency-check-report.html">🔒 OWASP Dependency Check Report</a></li>
                                <li><a href="${BUILD_URL}console">📋 Full Build Console Log</a></li>
                            </ul>

                            <h3>🔗 External Links:</h3>
                            <ul>
                                <li><a href="http://46.202.89.158:9000/dashboard?id=FitVerse">SonarQube Dashboard</a></li>
                                <li><a href="https://hub.docker.com/r/${DOCKER_USER}/${APP_NAME}">Docker Hub Repository</a></li>
                                <li><a href="https://github.com/xjohnfit/mern-fit-verse">GitHub Repository</a></li>
                            </ul>

                            <hr>
                            <p><small>Generated by Jenkins Pipeline at ${new Date()}</small></p>
                        </body>
                        </html>
                    """,
                    mimeType: 'text/html',
                    attachmentsPattern: 'trivy-*.txt,dependency-check-report.html'
                )

                echo """
                🎉 Pipeline Summary:
                ==================
                Build Result: ${buildResult}
                Duration: ${buildDuration}
                Docker Image: ${IMAGE_NAME}:${IMAGE_TAG}
                Build Type: ${params.BUILD_TYPE}
                ==================
                """
            }
        }

        success {
            echo '🎉 Pipeline completed successfully!'
        // Add Slack notification for success if configured
        // slackSend color: 'good', message: "✅ FitVerse Build #${BUILD_NUMBER} succeeded!"
        }

        failure {
            echo '❌ Pipeline failed!'
        // Add Slack notification for failure if configured
        // slackSend color: 'danger', message: "❌ FitVerse Build #${BUILD_NUMBER} failed!"
        }

        unstable {
            echo '⚠️ Pipeline completed with warnings!'
        // Add Slack notification for unstable builds if configured
        // slackSend color: 'warning', message: "⚠️ FitVerse Build #${BUILD_NUMBER} completed with warnings!"
        }

        cleanup {
            // Final cleanup - this runs regardless of build result
            sh '''
                echo "🧹 Final cleanup..."
                docker system df || true
            '''
        }
    }
}
