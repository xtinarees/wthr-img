# wthr-img

This repository stores the code for a [React](https://react.dev/) single page application built to visualize weather conditions. You can view the app [here](https://wthr-img.christinarees.com). It uses [Vite](https://vitejs.dev/) for local development and building static production files. It is hosted via [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) and uses a [CloudFront distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) and [Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html);

## Initial Config

1. Copy the `.env.example` file to `.env`: `cp .env.example .env`
2. Log into your [Open Weather Map](https://openweathermap.org) account to find/create your API key and add it to the `.env` file.

## Running locally

### Use compatible node and npm versions

```bash
nvm use
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## Deployments

No automation or staging environment has been set up. Follow these steps to update the production site manually:

1. Run `npm run build` locally.
1. Run `npm run preview` to preview the production files locally and confirm they are ready to deploy.
1. Upload files in `dist` directory to bucket via the AWS S3 GUI.

## AWS Resource Config

- S3 Bucket: `wthr-img`
- Cloudfront Distributuion: `EFN22DLER9L9Q`
- Route 53: `christinarees.com`
  - Record Name: `wthr-img.christinarees.com`, Type: A
  - Record Name: `wthr-img.christinarees.com`, Type: AAAA
