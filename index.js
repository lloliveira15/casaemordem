// index.js

const express = require('express');
const app = express();
const port = 3000;

// Permite ler dados enviados por formulários HTML
app.use(express.urlencoded({ extended: true }));

// Lista de tarefas em memória
let tarefas = [];

/*
Cada tarefa:
{
  descricao: 'Lavar louça',
  responsavel: 'lais' | 'marido' | 'ambos',
  feito: false,
  feitoPor: null // 'lais' ou 'marido'
}
*/

// Página principal: redireciona para a lista
app.get('/', (req, res) => {
  res.redirect('/lista');
});

// Mostra a lista de tarefas e o formulário
app.get('/lista', (req, res) => {
  const itens = tarefas
    .map((tarefa, index) => {
      const status = tarefa.feito ? '✅' : '⬜';
      const quemFez = tarefa.feitoPor ? ` (feito por: ${tarefa.feitoPor})` : '';
      const responsavel = tarefa.responsavel === 'ambos' ? 'Qualquer um' : tarefa.responsavel;

      return `
        <li>
          ${status} ${tarefa.descricao} 
          — responsável: <strong>${responsavel}</strong>${quemFez}
          <form action="/feito" method="POST" style="display:inline">
            <input type="hidden" name="indice" value="${index}" />
            <select name="quemFez">
              <option value="lais">Laís</option>
              <option value="marido">Marido</option>
            </select>
            <button type="submit">Marcar / Desmarcar</button>
          </form>
          <form action="/remover" method="POST" style="display:inline; margin-left: 8px;">
            <input type="hidden" name="indice" value="${index}" />
            <button type="submit">Remover</button>
          </form>
        </li>
      `;
    })
    .join('');

  res.send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Casa em Ordem</title>
      </head>
      <body>
        <h1>Casa em Ordem</h1>
        <p>App de tarefas a dois, sem cobrança chata :)</p>

        <h2>Adicionar tarefa</h2>
        <form action="/adicionar" method="POST">
          <input type="text" name="descricao" placeholder="Descrição da tarefa" required />
          <select name="responsavel">
            <option value="ambos">Qualquer um</option>
            <option value="lais">Laís</option>
            <option value="marido">Marido</option>
          </select>
          <button type="submit">Adicionar</button>
        </form>

        <h2>Lista de tarefas</h2>
        <ul>
          ${itens || '<li>Nenhuma tarefa ainda.</li>'}
        </ul>
      </body>
    </html>
  `);
});

// Adiciona uma tarefa nova
app.post('/adicionar', (req, res) => {
  const { descricao, responsavel } = req.body;

  if (descricao && descricao.trim() !== '') {
    tarefas.push({
      descricao: descricao.trim(),
      responsavel: responsavel || 'ambos',
      feito: false,
      feitoPor: null
    });
  }

  res.redirect('/lista');
});

// Marca ou desmarca como feito, e registra quem fez
app.post('/feito', (req, res) => {
  const { indice, quemFez } = req.body;

  if (indice !== undefined && tarefas[indice]) {
    const tarefa = tarefas[indice];
    tarefa.feito = !tarefa.feito;
    tarefa.feitoPor = tarefa.feito ? (quemFez || null) : null;
  }

  res.redirect('/lista');
});

// Remove tarefa
app.post('/remover', (req, res) => {
  const { indice } = req.body;

  if (indice !== undefined && tarefas[indice]) {
    tarefas.splice(indice, 1);
  }

  res.redirect('/lista');
});

app.listen(port, () => {
  console.log(`Casa em Ordem rodando em http://localhost:${port}`);
});
