# Install Coverity action

Coverity comes with a huge CLI (3GB archive) that this action downloads and caches.
The license is valid only for a year, so it will be downloaded every time.

Expects "jf" (jfrog) CLI to be set up.

## Prepare / Update Coverity binary

This step expects the Coverit archive to be uploaded to artifactory. Downloading from here provides a better performance (2.5min vs 25min). To get it there,

1. set coverity version: `export COV_VERSION=2022.12.0`
1. 1. go to Coverity UI -> Help -> Downloads -> scroll to bottom and download the linux archive
   1. \>OR< use the `username` and `key` values of the coverity technical key (can find it in meid-secrets repo) and

          # cd to secrets repo
          export COVERITY_AUTH_FILE=$(sops -d coverity_technical_app35167.key)
          user=$(jq -rn 'env.COVERITY_AUTH_FILE | fromjson.username')
          password=$(jq -rn 'env.COVERITY_AUTH_FILE | fromjson.key')
          curl  --insecure -L --user $user:$password \
          https://cov-connect.daimler.com/downloadFile.htm?fn=cov-analysis-linux64-${COV_VERSION}.tar.gz --output cov-analysis-linux64-${COV_VERSION}.tar.gz

1. Using any API_KEY (PID or your personal one) for artifactory:

        export API_KEY=
       curl -X PUT -Sf \
       -H "X-JFrog-Art-Api:$API_KEY" \
       -T cov-analysis-linux64-${COV_VERSION}.tar.gz \
       "https://artifacts.i.mercedes-benz.com/artifactory/ciam-meid-maven-snapshots/coverity/cov-analysis-linux64-${COV_VERSION}.tar.gz"

## Usage

```yaml
- name: 'setup: coverity'
  uses: CIAM-Me-Identity/workflows/actions/setup-coverity@v2
  with:
    coverity-version: 2022.12.0   # optional, see action.yml for current default
    coverity-auth-file: ${{ secrets.COVERITY_AUTH_FILE }}
    configure-language: node      # java is the default
```

## Development
1. Install dependencies: `npm i`
1. Make your changes in src/run.js
1. Build with `npm run build`
1. Push the changes
