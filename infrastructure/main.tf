terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.8"
    }
  }
  required_version = ">= 0.14.9"

  backend "s3" {
    bucket = "pokerstrap-terraform"
    key    = "infrastructure"
    region = "eu-west-3"
  }
}
