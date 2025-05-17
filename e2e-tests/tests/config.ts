
export const config = {
    apiGatewayUrl: process.env.API_GATEWAY_URL || "http://localhost:6000",
    authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:6001",
    accountServiceUrl: process.env.ACCOUNT_SERVICE_URL || "http://localhost:6002",
}
