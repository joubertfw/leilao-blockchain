// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Leilao
{
    address payable public gerente;
    address payable public ultimoPagador;
    uint256 public ultimoValor = 0;

    constructor(){
        gerente = payable(msg.sender);
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

    function iniciarLeilao(uint256 inicial) public verificaGerente{
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
