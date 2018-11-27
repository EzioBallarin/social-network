SRCDIR=src/social-network
PROJECT=ssu-social-network
REGISTRY=gcr.io/$(PROJECT)

.PHONY: ssu-social-network run-images push-images clean

ssu-social-network:
	docker build -t ssu-social-network:latest -f Dockerfile . 
	docker tag ssu-social-network:latest $(REGISTRY)/ssu-social-network:latest

run-images: ssu-social-network
	docker run -d --name nodejs -p 80:80 ssu-social-network

push-images:
	gcloud docker -- push $(REGISTRY)/ssu-social-network:latest

clean:
	docker rm -f `docker ps -aq`
