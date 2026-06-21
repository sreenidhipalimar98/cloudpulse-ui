# cloudpulse-ui

React dashboard for [CloudPulse](https://github.com/sreenidhipalimar98/cloudpulse-api) — a live console for AWS infrastructure health, deployment pipelines, and alerts.

## Tech Stack

- React 18 + Vite
- React Router for client-side navigation
- Recharts (available for future charting)
- CSS custom properties for theming (dark ops console design)
- AWS Amplify for hosting

## Getting Started

```bash
npm install
cp .env.example .env.local
# edit .env.local — set VITE_API_BASE_URL to your running API
npm start
```

Runs at `http://localhost:3000`.

## Hosting on AWS Amplify

1. In AWS Amplify Console: New app → Host web app
2. Connect this GitHub repo, select `main` branch
3. Amplify auto-detects `amplify.yml`
4. Add env variable: `VITE_API_BASE_URL = http://<your-alb-dns>.ap-south-1.elb.amazonaws.com`
5. Deploy

## Pages

- `/` — Overview (summary metrics, service status, alerts)
- `/infrastructure` — EC2, ECS, RDS resource tables
- `/pipelines` — CI/CD run history
- `/alerts` — Active alerts with severity

## Related

- [cloudpulse-api](https://github.com/sreenidhipalimar98/cloudpulse-api) — backend
- [CloudPulse-Terraform](https://github.com/sreenidhipalimar98/CloudPulse-Terraform) — infrastructure

## Author

**Sreenidhi Palimar** — DevOps Engineer

## License

MIT
