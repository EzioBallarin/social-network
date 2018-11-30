SRCDIR=src/social-network
PROJECT=ssu-social-network
REGISTRY=gcr.io/$(PROJECT)

.PHONY: ssu-social-network mariadb run-images push-images clean
.PHONY: create-deployment update-deployment
.PHONY: test
.PHONY: test-registration

ssu-social-network:
	docker build -t ssu-social-network:latest -f Dockerfile . 
	docker tag ssu-social-network:latest $(REGISTRY)/ssu-social-network:latest

mariadb:
	docker build -t mariadb:latest -f mariadb/Dockerfile .
	docker tag mariadb:latest $(REGISTRY)/mariadb:latest

run-images: ssu-social-network mariadb
	./scripts/run-images.sh

push-images:
	gcloud docker -- push $(REGISTRY)/ssu-social-network:latest
	gcloud docker -- push $(REGISTRY)/mariadb:latest

create-deployment:
	kubectl create -f kubernetes/social-network.yaml

update-deployment:
	./scripts/update_deployment.sh

#######################################
########### TESTING SCRIPTS ###########
#######################################

# Ensure the $NODE_IP and $TEST_REGISTER_ACCOUNT_NUM 
# environment variables are set before running these scripts
# $TEST_REGISTER_ACCOUNT_NUM defaults to 1000

test-registration:
	./scripts/tests/registration.sh

test: test-registration

clean:
	docker rm -f `docker ps -aq`
