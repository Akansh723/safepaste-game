
export const parapraghData = {
  text: `<p>Hi Team,<br><br>
  We’ll deploy the staging config to AWS at 4 PM today.<br>
  Please double-check the DB_PASSWORD, JWT_SECRET, api_key, and API_TOKEN in the .env file.<br>
  Our endpoint https://api.myservice.com is now authenticated with key: auth_token=sk_live_bafas123.<br><br>
  P.S. Don't forget to regenerate the accessToken12 and update DATABASE_URL.<br><br>
  Regards,<br>
  DevOps Lead</p>`,
  sensitiveData: ["DB_PASSWORD", "JWT_SECRET", "API_TOKEN", "https://api.myservice.com", "sk_live_bafas123", "accessToken12", "DATABASE_URL"]
}