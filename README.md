# jenkins-demo-app — Simple Jenkins CI/CD Pipeline

A Node.js (Express) app built, tested and deployed as a Docker container by a **declarative Jenkins pipeline** (`Jenkinsfile`).

## Pipeline stages
| Stage | What it does |
|---|---|
| Checkout | Pulls the code from Git |
| Build & Test | `docker build --target test` runs `npm ci` and `npm test` inside the Dockerfile's test stage (fails the pipeline if tests fail) |
| Docker Build | Builds image `jenkins-demo-app:<build#>` and `:latest` |
| Deploy | Replaces the running container and runs a health check on `/health` |

**Trigger:** `pollSCM` checks the repo every 2 minutes and runs on new commits.

## Run Jenkins locally with Docker
```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -u root jenkins/jenkins:lts-jdk17

# install the Docker CLI inside the Jenkins container
docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io"
```
Open http://localhost:8080, unlock with `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`, and install the suggested plugins (no extra plugins needed; only the Docker CLI inside the Jenkins container).

## Create the job
1. New Item → **Pipeline** → name it `jenkins-demo-app`.
2. Pipeline → *Pipeline script from SCM* → Git → paste this repo URL, branch `*/main`, script path `Jenkinsfile`.
3. Save → **Build Now**. Push a commit and watch it trigger automatically.
4. Visit http://localhost:8081 to see the deployed app.

## Run the app locally
```bash
npm install && npm test && npm start
```

## Screenshots
_Add screenshots of the Jenkins stage view and the running app here._
