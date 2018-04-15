import OdooRPC from '../src/odoorpc'

const odoo = new OdooRPC({
  domain: 'http://localhost',
  port: 8069,
  database: 'odoo11dev',
})

// odoo.exchangeToken('658655@gmail.com', 'password').then((response) => {
//   console.log(response.data)
// })

odoo.query({
  method: 'search_read',
  model: 'res.partner',
  domain: [
    ['customer', '=', 1],
    ['parent_id', '=', false],
  ],
  fields: [
    'id',
      'color',
      'display_name',
      'title',
      'email',
      'parent_id',
      'is_company',
      'function',
      'phone',
      'street',
      'street2',
      'zip',
      'city',
      'country_id',
      'mobile',
      'opportunity_count',
      'meeting_count',
      'state_id',
      'category_id',
      'image_small',
      'type',
  ],
  limit: 80,
}).then(({ data }) => {
  console.log(data)
})
