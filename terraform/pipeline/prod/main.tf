module "pipeline" {
  source          = "../module"
  app_name        = "client"
  environment     = "prod"
  branch          = "master"
  repository_name = "selina/selina-client"
}
provider "aws" {
  region = "eu-west-2"
}