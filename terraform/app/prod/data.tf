
variable "environment" {
  type    = string
  default = "prod"
}
variable "image" {
  type    = string
  default = "211125642419.dkr.ecr.eu-west-2.amazonaws.com/client:latest2"
}

# data "aws_ssm_parameter" "ADMIN_PASSWORD" {
#   name = "/${var.environment}/ADMIN_PASSWORD"
# }
# data "aws_ssm_parameter" "APP_SESSION_SECRET" {
#   name = "/${var.environment}/APP_SESSION_SECRET"
# }
# data "aws_ssm_parameter" "FACEBOOK_APP_ID" {
#   name = "/${var.environment}/FACEBOOK_APP_ID"
# }
