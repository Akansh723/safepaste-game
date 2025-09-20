export const parapraghData = {
  text: `<p>Subject: Urgent — Prod checks before midnight deployment<br><br>
  To: dev-team@acmesoft.example<br>
  From: Priya Mehra priya.m@acmesoft.example<br>
  Cc: eng-managers@acmesoft.example<br><br>
  Hi Team,<br><br>
  As discussed in the standup, we plan to roll out the hotfix to production tonight. Before I hand this off to SRE, please run a config sweep across the repo, CI artifacts, and any recent screenshots — we must be sure nothing sensitive is accidentally committed or logged. The production endpoints are https://api.acmesoft.com/v1/orders and https://payments.acmesoft.com/v1/charge; the payment webhook lives at https://hooks.acmesoft.com/payments.<br><br>
  While you’re checking, look for the usual secrets and keys embedded in files and scripts such as DB_PASSWORD=ProdDbP@ss!2025, DATABASE_URL=postgres://prod_user:ProdDbP@ss!2025@db.prod.acme:5432/proddb, JWT_SECRET=jwt_prod_AbC123_XyZ, API_KEY=ak_live_12345FAKE, API_TOKEN=token_prod_98765FAKE, CLIENT_SECRET=cli_sec_7890FAKE, SECRET_KEY_BASE=secretbase_prod_000, OAUTH_TOKEN=oauth_prod_456Token, SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T123/B456/WHFAKE123, SMTP_PASSWORD=smtpProdP@ss!2025, PRIVATE_KEY=-----BEGIN PRIVATE KEY-----FAKEPRODKEY-----END PRIVATE KEY-----, STRIPE_SECRET_KEY=sk_live_stripeFAKE123, AWS_SECRET_ACCESS_KEY=AKIAFAKESECRETEXAMPLE, REDIS_PASSWORD=redisProd!PW2025, and GITHUB_PAT=ghp_FAKEgithubpat_123456.<br><br>
  Treat any matches as high priority — rotate, remove from repo, and replace with vault references before the deploy. Note that some innocuous-looking placeholders like api_key_placeholder, dummy_token_000, PUBLIC_KEY_SAMPLE, demo_password, sample_token, NOT_A_SECRET_123, and CONFIG_FLAG=TRUE_LOOKS_SECRET are intentionally present in test data and should be ignored for rotation but still checked so we don’t confuse automated scanners.<br><br>
  <b>Action items for the developer assigned to this ticket (Ravi):</b><br>
  - Search the repo and CI logs for the 15 production-style secrets listed above and any other tokens.<br>
  - Ensure all real secrets are moved to Vault and replaced with VAULT:// references in config templates.<br>
  - Sanitize recent build logs (check artifacts/ci-logs/*.log) so nothing like PRIVATE_KEY or AWS_SECRET_ACCESS_KEY remains in plain text.<br>
  - Verify the webhook URL and payment endpoints do not expose STRIPE_SECRET_KEY or any auth token in query strings.<br>
  - Confirm test fixtures that intentionally include confusing tokens (api_key_placeholder, NOT_A_SECRET_123, dummy_token_000) are documented in the README so the security team knows they are non-sensitive.<br><br>
  If you find any sensitive values, open an incident in PagerDuty and notify me immediately with the file path and suggested remediation (rotate + replace with vault reference). I’ll coordinate with compliance to ensure rotation windows. Thanks — let’s be thorough so we can deploy on schedule.<br><br>
  Regards,<br>
  Priya Mehra<br>
  Engineering Manager, AcmeSoft</p>`,
  sensitiveData: [
    "dev-team@acmesoft.example",
    "priya.m@acmesoft.example",
    "eng-managers@acmesoft.example",
    "https://api.acmesoft.com/v1/orders",
    "https://payments.acmesoft.com/v1/charge",
    "https://hooks.acmesoft.com/payments",
    "ProdDbP@ss!2025",
    "postgres://prod_user:ProdDbP@ss!2025@db.prod.acme:5432/proddb",
    "jwt_prod_AbC123_XyZ",
    "ak_live_12345FAKE",
    "token_prod_98765FAKE",
    "cli_sec_7890FAKE",
    "secretbase_prod_000",
    "oauth_prod_456Token",
    "https://hooks.slack.com/services/T123/B456/WHFAKE123",
    "smtpProdP@ss!2025",
    "FAKEPRODKEY",
    "sk_live_stripeFAKE123",
    "AKIAFAKESECRETEXAMPLE",
    "redisProd!PW2025",
    "ghp_FAKEgithubpat_123456",
    "PRIVATE_KEY",
    "AWS_SECRET_ACCESS_KEY",
    "STRIPE_SECRET_KEY",
    "AcmeSoft"
  ]
}
