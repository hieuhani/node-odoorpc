import OdooRPC from '../src'

const odoo = new OdooRPC({
  domain: 'localhost',
  port: 8066,
  https: false,
  database: 'onion_odoo',
}, {
  dataKey: 'hello',
  storage: {
    getItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
    setItem: () => Promise.resolve(),
  },
})

odoo.exchangeToken('hieuhani', 'key.love92').then((response) => {
  console.log(response.data)
}).catch(e => {
  console.log(e)
})

// odoo.query({
//   method: 'search_read',
//   model: 'res.partner',
//   domain: [
//     ['customer', '=', 1],
//     ['parent_id', '=', false],
//   ],
//   fields: [
//     'id',
//       'color',
//       'display_name',
//       'title',
//       'email',
//       'parent_id',
//       'is_company',
//       'function',
//       'phone',
//       'street',
//       'street2',
//       'zip',
//       'city',
//       'country_id',
//       'mobile',
//       'opportunity_count',
//       'meeting_count',
//       'state_id',
//       'category_id',
//       'image_small',
//       'type',
//   ],
//   limit: 80,
// }).then(({ data }) => {
//   console.log(data)
// })
