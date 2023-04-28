# Setup Tools Action

Set up all our required tools (java, maven, kustomize, ...) at once.

## Usage
As part of your non-central pipeline:
```yaml
      - name: init
        uses: CIAM-Me-Identity/workflows/actions/init@init-v1
        with:
          checkout-workflows-ref: v2
          checkout-workflows-token: ${{ secrets.GH_ACCESSTOKEN }}
          post-cleanup: true
          # kube-setup-tools can be omitted if only using kustomize
          kube-setup-tools: |
            kubectl
            kustomize
            helm
          python-version: 3.11
          terraform-version: 1.3.7
          node-version: 14
          java-version: 11
          maven-version: 3.8.6
          gh-cli-version: 2.14.6
          kubectl-version: 1.23.14
          kustomize-version: 4.5.7
          helm-version: 3.9.2
          sops-version: latest
          gpg-private-key: ${{ secrets.MEID_TECHNICAL_DEV_GPG_KEY }}
          gpg-passphrase: ${{ secrets.MEID_TECHNICAL_DEV_GPG_SECRET }}
          ssh-private-key: ${{ secrets.GH_PID_SSH_PRIVATE_KEY }}
          jfrog-cli-version: latest
          jfrog-user: ${{ secrets.ARTIFACTORY_USERNAME }}
          jfrog-password: ${{ secrets.ARTIFACTORY_PASSWORD }}
          coverity-version: 2022.12.0  # can be omitted
          coverity-auth-file: ${{ secrets.COVERITY_AUTH_FILE }}
          coverity-configure-language: java  # can be omitted

      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          path: app # checkout your actual repo in a subdirectory and work there
```

As part of this repo:
```yaml
on:
  workflow_call:
    inputs:
      workflows-ref:
        description: "ref of the centralized workflows repo that was specified in 'jobs.<name>.uses'"
        required: true
        type: string
    secrets:
      GH_ACCESSTOKEN:
        required: true
        description: "GH PAT used for checking out the k8s-artifacts repo"
# ...
jobs:
  xyz:
    steps:
      - name: init
        uses: CIAM-Me-Identity/workflows/actions/init@init-v1
        with:
          checkout-workflows-ref: ${{ inputs.workflows-ref }}
          checkout-workflows-token: ${{ secrets.GH_ACCESSTOKEN }}
          java-version: 11

      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          path: app # checkout your actual repo in a subdirectory and work there
```

## Development
1. Update `action.yml`
1. Push the changes
