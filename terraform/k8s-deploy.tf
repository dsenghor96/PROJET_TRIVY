# Déploiement de l'app MERN sur EKS
resource "null_resource" "k8s_deploy" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.portfolio_cluster.name}"
  }

  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../k8s/configmap/"
  }

  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../k8s/secret/"
  }

  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../k8s/mongodb/"
  }

  provisioner "local-exec" {
    command = "sleep 30"
  }

  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../k8s/backend/"
  }

  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../k8s/frontend/"
  }

  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../k8s/ingress/"
  }

  provisioner "local-exec" {
    command = "kubectl get pods -n default"
  }

  depends_on = [
    helm_release.nginx_ingress,
    null_resource.gp2_default_storageclass,
    aws_eks_addon.ebs_csi_driver
  ]
}
