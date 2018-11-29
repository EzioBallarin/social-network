SRCDIR=src/social-network
PROJECT=ssu-social-network
REGISTRY=gcr.io/$(PROJECT)

.PHONY: ssu-social-network mariadb run-images push-images clean
.PHONY: create-deployment update-deployment

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

clean:
	docker rm -f `docker ps -aq`
