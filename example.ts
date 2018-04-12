import OdooRPC from './src/odoorpc'

const odoo = new OdooRPC({
  domain: 'http://localhost',
  port: 8069,
  database: 'odoo11',
})

// odoo.exchangeToken('658655@gmail.com', 'password').then((response) => {
//   console.log(response.data)
// })

// odoo.get().then((response) => {
//   console.log(response.data)
// })
