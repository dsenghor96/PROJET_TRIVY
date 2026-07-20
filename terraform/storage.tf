# Patch la StorageClass gp2 existante pour la marquer default
resource "null_resource" "gp2_default_storageclass" {
  triggers = {
    cluster_name = aws_eks_cluster.portfolio_cluster.name
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.portfolio_cluster.name}
      kubectl patch storageclass gp2 -p '{"metadata": {"annotations": {"storageclass.kubernetes.io/is-default-class": "true"}}}'
    EOT
  }

  depends_on = [
    aws_eks_addon.ebs_csi_driver
  ]
}
