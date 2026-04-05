# Ticketz PRO Docs

Static multilingual documentation prepared for the repository `ticketz-oss/ticketzpro-docs.github.io`.

## Stack

- Native GitHub Pages with Jekyll
- Three language sections: English, Portuguese, and Spanish
- Root redirect based on `navigator.language`
- Example files hosted locally under `assets/examples/` to avoid GitHub raw rate limits

## Publish

1. Copy the contents of this directory to the root of the target repository.
2. In GitHub, enable Pages for the default branch root.
3. If you use a custom domain, change `baseurl` in `_config.yml` to an empty string.
