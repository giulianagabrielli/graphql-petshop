const { GraphQLServer } = require('graphql-yoga') //npm install graphql-yoga
const conexao = require('./infraestrutura/conexao') //conexao com o banco
const Tabelas = require('./infraestrutura/database/tabelas') //criação de tabelas

const Operacoes = require('./infraestrutura/operations')

conexao.connect(erro => {
  if (erro) {
    console.log(erro)
  }

  console.log('conectou no banco')

  Tabelas.init(conexao)
})

const Clientes = new Operacoes('cliente')

const resolvers = {
  Query: {
    status: () => "Servidor rodando ",
    clientes: () => Clientes.lista(),
    cliente: (root, { id }) => Clientes.buscaPorId(id)
  }, 
  Mutation: {
    adicionarCliente: (root, params) => Clientes.adiciona(params),
    atualizarCliente: (root, params) => Clientes.atualiza(params),
    deletarCliente: (root, { id }) => Clientes.deleta(id)
  }
}

const servidor = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql'
})

servidor.start(() => console.log('servidor ouvindo'))