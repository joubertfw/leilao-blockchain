import React, { useState, useEffect } from "react";
// Configuração para requisições na rede
import web3 from "./web3";
// Informação do contrato
import leilao from "./leilao";

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // Cria variáveis e funções de alteração
  const [gerente, setGerente] = useState("");
  const [ultimoPagador, setUltimoPagador] = useState("");
  const [value, setValue] = useState("");
  const [lanceMinimo, setLanceMinimo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ultimoValor, setUltimoValor] = useState("");

  // Função assincrona que carrega os dados do contrato
  const carregarDados = async () => {
    // Pega a carteira do gerente do contrato
    const _gerente = await leilao.methods.gerente().call();
    // Pega a carteira dos jogadores
    const _ultimoPagador = await leilao.methods.getUltimoPagador().call();
    // Pega o valor total vinculado ao contrato
    const _ultimoValor = await leilao.methods.getUltimoValor().call();

    // Armazena os valores nas variáveis de gerente, jogador e saldo
    setGerente(_gerente);
    setUltimoPagador(_ultimoPagador);
    setUltimoValor(_ultimoValor);
    setValue("");
  };
  // Antes da página carregar ele chama seu conteúdo
  useEffect(() => {
    // Busca dados do contrato
    carregarDados();
  }, []);

  // * Realiza uma aposta
  const fazerLance = async (event) => {
    try {
      // Evita que a página seja recarregada
      event.preventDefault();
      // Altera valor da mensagem exibida
      setMensagem("Aguardando a  validação da transação...");
      // Pega contas do metamask
      const contas = await web3.eth.getAccounts();
      // console.log(contas);

      // Joga passando valor da conta principal e o valor de ether em wei
      await leilao.methods.fazerLance().send({
        from: contas[0],
        value: web3.utils.toWei(value, "ether"),
      });
      setMensagem("Aguardando a transação...");
      // Recarrega dados da página
      await carregarDados();
      // Altera mensagem
      setMensagem("Transação concluida!");
    } catch (error) {
      // Caso o usuário cancele a solicitação no metamask
      if (error.code === 4001) {
        setMensagem("Transação cancelada!");
      } else {
        // Caso algo esteja fora das políticas do contrato
        setMensagem("Transação vai contra regras do contrato");
      }
    }
  };

  const iniciarLeilao = async (event) => {
    try {
      // Evita que a página seja recarregada
      event.preventDefault();
      const contas = await web3.eth.getAccounts();

      // Joga passando valor da conta principal e o valor de ether em wei
      await leilao.methods.iniciarLeilao(lanceMinimo).send({from: contas[0]});
      setMensagem("Aguardando a transação...");
      await carregarDados();
      // Altera mensagem
      setMensagem("Transação concluida!");
    } catch (error) {
      // Caso o usuário cancele a solicitação no metamask
      if (error.code === 4001) {
        setMensagem("Transação cancelada!");
      } else {
        // Caso algo esteja fora das políticas do contrato
        setMensagem("Transação vai contra regras do contrato");
      }
    }
  };

  const encerrarLeilao = async (event) => {
    try {
      // Evita que a página seja recarregada
      event.preventDefault();
      const contas = await web3.eth.getAccounts();

      // Joga passando valor da conta principal e o valor de ether em wei
      await leilao.methods.encerrarLeilao().send({from: contas[0]});
      setMensagem("Aguardando a transação...");
      await carregarDados();
      // Altera mensagem
      setMensagem("Transação concluida!");
    } catch (error) {
      // Caso o usuário cancele a solicitação no metamask
      if (error.code === 4001) {
        setMensagem("Transação cancelada!");
      } else {
        // Caso algo esteja fora das políticas do contrato
        setMensagem("Transação vai contra regras do contrato");
      }
    }
  };

  return (

    <div className='row my-4'>
    <div className='col-md-10 offset-md-1'>
    <div className='card card-outline h-100'>
        <div className='card-header bg-info text-white'>
          <h2>Contrato de Leilão</h2>
        </div>
        <div className='card-body bg-light'>

          <p>Este contrato é gerenciado por {gerente}</p>
          <p>Ultimo lance: {ultimoPagador} ofertando {ultimoValor} ETH</p>
          <br />

          <div className='form-group'>
            <label>Quantidade de ether de lance: </label>
            <input className='form-control' value={value} onChange={(event) => setValue(event.target.value)}/>
          </div>
          <button className='btn btn-primary' onClick={fazerLance}>Lance</button>

          <hr />

          <div className='form-group'>
            <label>Lance minimo: </label>
            <input className='form-control' value={lanceMinimo} onChange={(event) => setLanceMinimo(event.target.value)}/>
          </div>
          <button className='btn btn-primary' onClick={iniciarLeilao}>Iniciar</button>
          <button className='btn btn-primary mx-3' onClick={encerrarLeilao}>Encerrar</button>
          <hr />
          {/* Mostra mensagem ao usuário */}
          <h3>{mensagem}</h3>
        </div>
      </div>

    </div>
    </div>
  );
};

export default App;