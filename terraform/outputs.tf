output "vpc_id" {
  description = "ID du VPC"
  value       = aws_vpc.portfolio_vpc.id
}

output "eks_cluster_name" {
  description = "Nom du cluster EKS"
  value       = aws_eks_cluster.portfolio_cluster.name
}

output "eks_cluster_endpoint" {
  description = "Endpoint du cluster EKS"
  value       = aws_eks_cluster.portfolio_cluster.endpoint
}

output "eks_kubeconfig_command" {
  description = "Commande pour connecter kubectl à EKS"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.portfolio_cluster.name}"
}
