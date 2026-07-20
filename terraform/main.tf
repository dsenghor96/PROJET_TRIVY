# Data source - AZ disponibles
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC
resource "aws_vpc" "portfolio_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name    = "${var.project_name}-vpc"
    Project = var.project_name
  }
}

# Subnet AZ-a
resource "aws_subnet" "portfolio_subnet_a" {
  vpc_id                  = aws_vpc.portfolio_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-subnet-a"
    Project = var.project_name
  }
}

# Subnet AZ-b
resource "aws_subnet" "portfolio_subnet_b" {
  vpc_id                  = aws_vpc.portfolio_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-subnet-b"
    Project = var.project_name
  }
}

# Internet Gateway
resource "aws_internet_gateway" "portfolio_igw" {
  vpc_id = aws_vpc.portfolio_vpc.id

  tags = {
    Name    = "${var.project_name}-igw"
    Project = var.project_name
  }
}

# Route Table
resource "aws_route_table" "portfolio_rt" {
  vpc_id = aws_vpc.portfolio_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.portfolio_igw.id
  }

  tags = {
    Name    = "${var.project_name}-rt"
    Project = var.project_name
  }
}

# Association Route Table → Subnet A
resource "aws_route_table_association" "portfolio_rta_a" {
  subnet_id      = aws_subnet.portfolio_subnet_a.id
  route_table_id = aws_route_table.portfolio_rt.id
}

# Association Route Table → Subnet B
resource "aws_route_table_association" "portfolio_rta_b" {
  subnet_id      = aws_subnet.portfolio_subnet_b.id
  route_table_id = aws_route_table.portfolio_rt.id
}

# IAM Role - EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.project_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# IAM Role - EKS Node Group
resource "aws_iam_role" "eks_node_role" {
  name = "${var.project_name}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_ecr_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# EKS Cluster
resource "aws_eks_cluster" "portfolio_cluster" {
  name     = "${var.project_name}-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [
      aws_subnet.portfolio_subnet_a.id,
      aws_subnet.portfolio_subnet_b.id
    ]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# EKS Node Group
resource "aws_eks_node_group" "portfolio_nodes" {
  cluster_name    = aws_eks_cluster.portfolio_cluster.name
  node_group_name = "${var.project_name}-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn

  subnet_ids = [
    aws_subnet.portfolio_subnet_a.id,
    aws_subnet.portfolio_subnet_b.id
  ]

  instance_types = [var.instance_type]

  scaling_config {
    desired_size = 2
    min_size     = 1
    max_size     = 2
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_ecr_policy
  ]
}

# Policy EBS CSI Driver pour les nodes
resource "aws_iam_role_policy_attachment" "eks_ebs_csi_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  role       = aws_iam_role.eks_node_role.name
}

# OIDC Provider pour IRSA
data "tls_certificate" "eks_oidc" {
  url = aws_eks_cluster.portfolio_cluster.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks_oidc" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks_oidc.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.portfolio_cluster.identity[0].oidc[0].issuer

  tags = {
    Name    = "${var.project_name}-oidc"
    Project = var.project_name
  }
}

# EBS CSI Driver - Addon EKS managé
resource "aws_eks_addon" "ebs_csi_driver" {
  cluster_name             = aws_eks_cluster.portfolio_cluster.name
  addon_name               = "aws-ebs-csi-driver"
  service_account_role_arn = aws_iam_role.ebs_csi_irsa_role.arn
  resolve_conflicts_on_create = "OVERWRITE"

  depends_on = [
    aws_eks_node_group.portfolio_nodes,
    aws_iam_role_policy_attachment.ebs_csi_irsa_policy
  ]

  tags = {
    Name    = "${var.project_name}-ebs-csi"
    Project = var.project_name
  }
}

# IRSA - IAM Role pour MongoDB (accès EBS)
data "aws_iam_policy_document" "mongodb_irsa_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks_oidc.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks_oidc.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:default:mongodb"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks_oidc.url, "https://", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "mongodb_irsa_role" {
  name               = "${var.project_name}-mongodb-irsa"
  assume_role_policy = data.aws_iam_policy_document.mongodb_irsa_trust.json

  tags = {
    Name    = "${var.project_name}-mongodb-irsa"
    Project = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "mongodb_ebs_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  role       = aws_iam_role.mongodb_irsa_role.name
}

# IRSA - IAM Role pour EBS CSI Driver
data "aws_iam_policy_document" "ebs_csi_irsa_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks_oidc.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks_oidc.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks_oidc.url, "https://", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ebs_csi_irsa_role" {
  name               = "${var.project_name}-ebs-csi-irsa"
  assume_role_policy = data.aws_iam_policy_document.ebs_csi_irsa_trust.json

  tags = {
    Name    = "${var.project_name}-ebs-csi-irsa"
    Project = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "ebs_csi_irsa_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  role       = aws_iam_role.ebs_csi_irsa_role.name
}
