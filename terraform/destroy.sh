#!/bin/bash
set -uo pipefail

# ==============================================================================
# destroy.sh — Terraform destroy avec nettoyage automatique des ressources
# orphelines (Load Balancers, instances EC2) qui bloquent la suppression
# de l'Internet Gateway / VPC.
#
# Usage : ./destroy.sh
# A lancer depuis le dossier terraform/ de PROJET_TRIVY (ou adapter TF_DIR)
# ==============================================================================

REGION="us-east-1"
JENKINS_CONTAINER="portfolio_jenkins"
WORKSPACE_TF_DIR="/var/jenkins_home/workspace/portfolio-pipeline/terraform"
MAX_ATTEMPTS=5
WAIT_SECONDS=60

# --- Fonction : lance terraform destroy dans le conteneur Jenkins ----------
run_terraform_destroy() {
    echo ">>> Lancement de terraform destroy dans ${JENKINS_CONTAINER}..."
    docker exec -it --user root "${JENKINS_CONTAINER}" bash -c "
        cd ${WORKSPACE_TF_DIR} &&
        AWS_ACCESS_KEY_ID=\$(aws configure get aws_access_key_id) \
        AWS_SECRET_ACCESS_KEY=\$(aws configure get aws_secret_access_key) \
        terraform destroy -auto-approve
    "
}

# --- Fonction : récupère l'ID du VPC depuis le state Terraform -------------
get_vpc_id() {
    docker exec --user root "${JENKINS_CONTAINER}" bash -c "
        cd ${WORKSPACE_TF_DIR} &&
        VPC_ADDR=\$(terraform state list 2>/dev/null | grep -m1 aws_vpc) &&
        terraform state show \"\$VPC_ADDR\" 2>/dev/null | awk -F'\"' '/^[[:space:]]*id[[:space:]]/ {print \$2; exit}'
    "
}

# --- Fonction : supprime les Load Balancers (NLB/ALB) restants dans le VPC -
cleanup_load_balancers() {
    local vpc_id="$1"
    echo ">>> Recherche de Load Balancers dans ${vpc_id}..."
    local lb_arns
    lb_arns=$(aws elbv2 describe-load-balancers --region "${REGION}" \
        --query "LoadBalancers[?VpcId=='${vpc_id}'].LoadBalancerArn" \
        --output text)

    if [ -n "${lb_arns}" ]; then
        for arn in ${lb_arns}; do
            echo "    Suppression du Load Balancer : ${arn}"
            aws elbv2 delete-load-balancer --region "${REGION}" --load-balancer-arn "${arn}"
        done
        echo "    Attente de la libération des interfaces réseau (60s)..."
        sleep 60
    else
        echo "    Aucun Load Balancer trouvé."
    fi
}

# --- Fonction : termine les instances EC2 avec IP publique dans le VPC -----
cleanup_ec2_instances() {
    local vpc_id="$1"
    echo ">>> Recherche d'instances EC2 avec IP publique dans ${vpc_id}..."
    local instance_ids
    instance_ids=$(aws ec2 describe-network-interfaces --region "${REGION}" \
        --filters "Name=vpc-id,Values=${vpc_id}" \
        --query "NetworkInterfaces[?Association.PublicIp!=null && Attachment.InstanceId!=null].Attachment.InstanceId" \
        --output text)

    if [ -n "${instance_ids}" ]; then
        echo "    Terminaison des instances : ${instance_ids}"
        aws ec2 terminate-instances --region "${REGION}" --instance-ids ${instance_ids}
        echo "    Attente de la terminaison complete (60s)..."
        sleep 60
    else
        echo "    Aucune instance EC2 bloquante trouvée."
    fi
}

# --- Boucle principale -------------------------------------------------------
attempt=1
while [ "${attempt}" -le "${MAX_ATTEMPTS}" ]; do
    echo ""
    echo "=== Tentative ${attempt}/${MAX_ATTEMPTS} ==="

    output=$(run_terraform_destroy 2>&1)
    echo "${output}"

    if echo "${output}" | grep -q "Destroy complete!"; then
        echo ""
        echo ">>> SUCCES : infrastructure detruite."
        exit 0
    fi

    if echo "${output}" | grep -q "DependencyViolation\|context deadline exceeded"; then
        echo ""
        echo ">>> Blocage detecte, nettoyage des ressources orphelines..."
        vpc_id=$(get_vpc_id)

        if [ -z "${vpc_id}" ]; then
            echo ">>> Impossible de determiner le VPC ID depuis le state. Arret."
            exit 1
        fi

        echo ">>> VPC concerne : ${vpc_id}"
        cleanup_load_balancers "${vpc_id}"
        cleanup_ec2_instances "${vpc_id}"

        echo ">>> Nouvelle tentative dans ${WAIT_SECONDS}s..."
        sleep "${WAIT_SECONDS}"
    else
        echo ""
        echo ">>> Erreur non geree par ce script. Verifie manuellement les logs ci-dessus."
        exit 1
    fi

    attempt=$((attempt + 1))
done

echo ""
echo ">>> Nombre maximal de tentatives (${MAX_ATTEMPTS}) atteint sans succes."
exit 1
