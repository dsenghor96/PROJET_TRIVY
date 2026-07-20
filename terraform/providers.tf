terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data source pour récupérer le token d'auth EKS
data "aws_eks_cluster_auth" "portfolio" {
  name = aws_eks_cluster.portfolio_cluster.name
}

provider "kubernetes" {
  host                   = aws_eks_cluster.portfolio_cluster.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.portfolio_cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.portfolio.token
}

provider "helm" {
  kubernetes {
    host                   = aws_eks_cluster.portfolio_cluster.endpoint
    cluster_ca_certificate = base64decode(aws_eks_cluster.portfolio_cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.portfolio.token
  }
}
