[![Build Status](https://travis-ci.org/lk-architecture/lk-archive-to-s3.svg?branch=master)](https://travis-ci.org/lk-architecture/lk-archive-to-s3)
[![codecov.io](https://codecov.io/github/lk-architecture/lk-archive-to-s3/coverage.svg?branch=master)](https://codecov.io/github/lk-architecture/lk-archive-to-s3?branch=master)
[![Dependency Status](https://david-dm.org/lk-architecture/lk-archive-to-s3.svg)](https://david-dm.org/lk-architecture/lk-archive-to-s3)
[![devDependency Status](https://david-dm.org/lk-architecture/lk-archive-to-s3/dev-status.svg)](https://david-dm.org/lk-architecture/lk-archive-to-s3#info=devDependencies)

# lk-archive-to-s3

Archive Kinesis events on S3.

## Deployment

### Continuous deployment

Since the project uses TravisCI and
[`lambda-deploy`](https://github.com/lk-architecture/lambda-deploy/) for continuous
deployment, the following environment variables need to be set:

- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_DEFAULT_REGION`
- `S3_BUCKET`
- `LAMBDA_NAME`
- `LAMBDA_ROLE_ARN`

WARNING: the value of those variables must be kept secret. Do not set them in
the `.travis.yml` config file, only in the Travis project's settings (where they
are kept secret).

### Configuration

The following environment variables are needed to configure the function:

- `S3_BUCKET`

NOTE: since the project uses `lambda-deploy`, in the build environment (Travis)
we need to define the above variables with their name prefixed by
`__FUNC_CONFIG__`.
