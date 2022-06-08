resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.env_name}-main-userpool"
}

resource "aws_cognito_user_pool_client" "client" {
  name                = "${var.project_name}-${var.env_name}-main-userpool-client"
  user_pool_id        = aws_cognito_user_pool.main.id
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}
