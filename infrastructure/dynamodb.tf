resource "aws_dynamodb_table" "connections-table" {
  name         = "${var.project_name}-${var.env_name}-Connections"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ConnectionId"

  attribute {
    name = "ConnectionId"
    type = "S"
  }
}
