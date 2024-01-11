# BOILED-Egg Visualization

See [A BOILED-Egg to predict gastrointestinal absorption and brain penetration of small molecules. ChemMedChem (2016) 11(11):1117-1121](http://onlinelibrary.wiley.com/doi/10.1002/cmdc.201600182/abstract) for full reference and supporting dataset.

## The stack
- [FastAPI](https://fastapi.tiangolo.com/) for the api.
- [NextJS](https://nextjs.org/) for the web ui.
- [RDKit](https://www.rdkitjs.com/) to render molecules (svg).
- [d3](https://d3js.org/) for the data visualization.
- [Docker](https://www.docker.com/) to run as containers.

## How to run
Be sure you have `docker` installed and up and running: 
```bash
$ docker --version
Docker version 24.0.6, build f0df350
```

Then run the following commands to run the api service:
```bash
$ docker-compose up api -d
```

Then run the following commands to build an run up the web service:
```bash
$ docker-compose up web -d
```

Go to [localhost:3000](http://localhost:3000/) to see the web ui. 
Go to [localhost:8000/docs](http://localhost:8000/docs) to see the api documentation.

## Things left to do
- [ ] better error handling on the api
- [ ] fix typescript oddities left behind
- [ ] writing tests across the board
