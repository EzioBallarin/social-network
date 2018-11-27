#!/bin/bash
old_replicas=$(kubectl get deployment/social-network -o jsonpath='{.spec.replicas}')
echo "returning deployment/social-network to $old_replicas"
kubectl scale --replicas=0 deployment/social-network
kubectl scale --replicas=$old_replicas deployment/social-network
