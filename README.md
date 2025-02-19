<h1>ThreeFold DePIN Board</h1>


to run in development mode

```bash
#first time to get hero
curl https://raw.githubusercontent.com/freeflowuniverse/herolib/refs/heads/development_kristof10/install_hero.sh > /tmp/install_hero.sh
bash /tmp/install_hero.sh
#DONT FORGET TO START A NEW SHELL (otherwise the paths will not be set)

hero docusaurus -u https://git.ourworld.tf/tfgrid/info_docs_depin -d
```

to push

```bash
hero docusaurus -u https://git.ourworld.tf/tfgrid/info_docs_depin -b

#push for development:
hero docusaurus -u https://git.ourworld.tf/tfgrid/info_docs_depin -bd
```

## URL

- The production website is available at `https://info.ourworld.tf/depin`
- The staging website is available at `https://info.ourworld.tf/depindev`