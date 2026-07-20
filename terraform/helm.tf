# Nginx Ingress Controller via Helm
resource "helm_release" "nginx_ingress" {
  name             = "nginx-ingress"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "ingress-nginx"
  create_namespace = true
  version          = "4.10.1"

  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-type"
    value = "nlb"
  }

  depends_on = [
    aws_eks_node_group.portfolio_nodes,
    null_resource.gp2_default_storageclass
  ]
}

# Output - hostname du LoadBalancer Nginx
output "nginx_ingress_hostname" {
  description = "Hostname du LoadBalancer Nginx Ingress"
  value       = helm_release.nginx_ingress.status
}

# Namespace monitoring
resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }

  depends_on = [
    aws_eks_node_group.portfolio_nodes
  ]
}

# Prometheus + Grafana via Helm (kube-prometheus-stack)
resource "helm_release" "prometheus_stack" {
  name       = "prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  version    = "61.1.0"

  set {
    name  = "grafana.adminPassword"
    value = "GrafanaAdmin2024!"
  }

  set {
    name  = "grafana.service.type"
    value = "LoadBalancer"
  }

  set {
    name  = "grafana.persistence.enabled"
    value = "true"
  }

  set {
    name  = "grafana.persistence.size"
    value = "5Gi"
  }

  set {
    name  = "prometheus.prometheusSpec.retention"
    value = "15d"
  }

  set {
    name  = "prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage"
    value = "10Gi"
  }

  set {
    name  = "alertmanager.enabled"
    value = "true"
  }

  depends_on = [
    aws_eks_node_group.portfolio_nodes,
    kubernetes_namespace.monitoring,
    helm_release.nginx_ingress
  ]
}

# Output - URL de Grafana
output "grafana_url" {
  description = "URL publique de Grafana"
  value       = "Recuperer avec : kubectl get svc -n monitoring prometheus-stack-grafana"
}
