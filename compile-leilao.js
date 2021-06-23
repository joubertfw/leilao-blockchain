const path = require("path"); // linhas para indicar o caminho onde o arquivo será lido
const fs = require("fs"); // e garantir a compatibilidade de sistemas operacionais
const solc = require("solc");

// Pega o arquivo Inbox.sol e atribui a variável
const LeilaoPath = path.resolve(__dirname, "contracts", "Leilao.sol");
const source = fs.readFileSync(LeilaoPath, "utf8");

// * Mais informações sobre o input e output
// * https://docs.soliditylang.org/en/v0.7.4/using-the-compiler.html#output-description
var input = {
  language: "Solidity",
  sources: {
    "Leilao.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
let contratoCompilado = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(JSON.stringify(contratoCompilado.contracts["Leilao.sol"].Leilao.abi,null,4));

module.exports = contratoCompilado.contracts["Leilao.sol"].Leilao;
