module "ecs-service" {
  source      = "../module"
  environment = var.environment
  cluster_arn = "arn:aws:ecs:eu-west-2:211125642419:cluster/prod-cluster"
  subnet_ids  = ["subnet-0fc30fbddf024c925", "subnet-07b4e02d8ef9ace5b", "subnet-08d271a06428162c9"]
  image = var.image
  service = {
    service_name = "client"
    environment = []
  }
}
provider "aws" {
  region = "eu-west-2"
}
