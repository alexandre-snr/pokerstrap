output "REGION" {
  value = data.aws_region.current.name
}

output "STAGE_NAME" {
  value = var.env_name
}

output "CONNECTIONS_TABLE_ARN" {
  value = aws_dynamodb_table.connections-table.arn
}

output "CONNECTIONS_TABLE" {
  value = aws_dynamodb_table.connections-table.name
}
