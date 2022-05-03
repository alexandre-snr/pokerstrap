provider "aws" {
  region  = "eu-west-3"
}

data "aws_region" "current" {}
