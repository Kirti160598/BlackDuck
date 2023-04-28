# Install GH CLI action

Selfhosted runners do not come with the GH CLI out of the box. This action is an easy-to-use way to install it.

## Usage

```yaml
- name: Setup GH CLI
  uses: CIAM-Me-Identity/workflows/actions/setup-gh-cli@v1
  with:
    gh-cli-version: 2.14.6 # optional, see action.yml for current default
```

## Development
1. Install dependencies: `npm i`
1. Make your changes in src/run.js
1. Build with `npm run build`
1. Push the changes
