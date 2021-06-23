// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract GerenteDeContratos{
    Leilao[] public leiloesEmAndamento;
    
    function criaLeilao(uint256 inicial) public{
        Leilao novoLeilao = new Leilao(msg.sender);
        novoLeilao.iniciarLeilao(inicial);
        leiloesEmAndamento.push(novoLeilao);
    }

    function listarLeiloesAndamento() public view returns (Leilao[] memory){
        return leiloesEmAndamento;
    }
}


contract Leilao
{
    address payable public gerente;
    address payable public ultimoPagador;
    uint256 public ultimoValor = 0;

    constructor(address criador){
        gerente = payable(criador);
    }

    function fazerLance() public payable verificaNaoGerente{
        require(ultimoValor != 0, "Aguarde o inicio do leilao");
        require(msg.sender != ultimoPagador, "Voce fez o ultimo lance");
        require(msg.value > ultimoValor, "Forneca um valor maior que o lance atual");
        if(ultimoPagador != payable(address(0)))
            ultimoPagador.transfer(address(this).balance - msg.value);
        ultimoPagador = payable(msg.sender);
        ultimoValor = msg.value;
    }

    function iniciarLeilao(uint256 inicial) public {
        require(ultimoValor == 0, "Leilao ja iniciado");
        ultimoValor = inicial * (1 ether);
    }

    function encerrarLeilao() public verificaGerente{
        require(ultimoValor != 0, "Aguarde o inicio do leilao");
        ultimoValor = 0;
        ultimoPagador = payable(address(0));
        gerente.transfer(address(this).balance);

    }

    modifier verificaGerente(){
        require(payable(msg.sender) == gerente, "Precisa ser gerente do app");
        _;
    }

    modifier verificaNaoGerente(){
        require(payable(msg.sender) != gerente, "Nao pode ser gerente do app");
        _;
    }

    function getUltimoPagador() public view returns(address payable){
        return ultimoPagador;
    }

     function getUltimoValor() public view returns(uint){
        return ultimoValor / (1 ether);
    }
}