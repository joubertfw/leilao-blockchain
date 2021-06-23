// Importa modulo dotenv para leitura o arquivo .env
require("dotenv").config();
//Provedor das carteiras que vamos usar
const HDWalletProvider = require("@truffle/hdwallet-provider");
//Construtor do Web3
const Web3 = require("web3");

// Importar o codigo dos bytecodes e da interface
const { abi, evm } = require("./compile-leilao");

// Passamos dois argumentos, as palavras mnemonicas e o link da rede infura
const provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.mnemonic
  },
  providerOrUrl: "https://rinkeby.infura.io/v3/de974303fa154e029a5a1cf55cb6fd32",
  chainId: 4
});

// Enviamos para o Web3 o provider
const web3 = new Web3(provider);



const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  //Recuperamos as contas
  console.log("Contas usadas para o deploy ", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "1000000", from: accounts[0] });
  // console.log(abi);
  console.log("Contrato implementado em ", result.options.address);

  // chamado para fechar o provider de forma adequada
  provider.engine.stop();
};

deploy();
