SRCDIR=src/social-network
PROJECT=ssu-social-network
REGISTRY=gcr.io/$(PROJECT)

.PHONY: ssu-social-network run-images push-images clean
.PHONY: create-deployment update-deployment

ssu-social-network:
	docker build -t ssu-social-network:latest -f Dockerfile . 
	#docker rmi $(REGISTRY)/ssu-social-network:latest
	docker tag ssu-social-network:latest $(REGISTRY)/ssu-social-network:latest

run-images: ssu-social-network
	docker run -d --name nodejs -p 80:80 ssu-social-network

push-images:
	gcloud docker -- push $(REGISTRY)/ssu-social-network:latest

create-deployment:
	kubectl create -f kubernetes/social-network.yaml

update-deployment:
	./scripts/update_deployment.sh

clean:
	docker rm -f `docker ps -aq`
