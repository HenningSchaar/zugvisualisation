# zugvisualisation
Create a visualisation for zugfinder data.

## Installation

before installing, you need Node.js and http-server

```bash
brew install nodejs

npm install http-server -g
```

If you don't have Homebrew installed, [here](https://brew.sh/index_de) is a guide.

To install execute the following commands

```bash
git clone https://github.com/HenningSchaar/zugvisualisation.git

cd zugvisualisation

git submodule --init --recursive

curl -LO https://github.com/processing/p5.js/releases/download/0.10.2/p5.zip

unzip p5.zip && rm -r __MACOSX/ && rm p5.zip

npm i

cd p5js-osc && npm i
```

## Run

To Run, navigate to zugvisualisation and execute 

```bash
http-server --cors=Autorization
```

Open a second shell and navigate to zugvisualisation/p5js-osc and execute

```bash
node bridge.js
```

Then open zugvisualisation/index.html in Safari. For this to work you have to tick the option **Develop > Disable Local File Restrictions** and **Develop > Disable Cross-Origin Restrictions**