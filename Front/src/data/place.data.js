export const placeFields = [
  {
    groupName: 'Object',
    fields: [
      {
        fieldName: 'name',
        name: 'Name',
        type: 'text',
        autofull: false,
        required: true,
        info: false,
      },
      {
        fieldName: 'category',
        name: 'Category',
        type: 'text',
        autofull: true,
        required: true,
        info: true,
      },
      {
        fieldName: 'features',
        name: 'Features',
      },
    ]
  },
  {
    groupName: 'Contacts',
    fields: [
      {
        fieldName: 'phone',
        name: 'Phone',
        type: 'tel',
        autofull: false,
        required: true,
        placeholder: "+",
        info: true,
      },
      {
        fieldName: 'site',
        name: 'Site',
        type: 'url',
        autofull: false,
        required: false,
        placeholder: "example.com",
        info: true,
      },
      {
        fieldName: 'email',
        name: 'E-mail',
        type: 'email',
        autofull: false,
        required: false,
        info: true,
      },
    ]
  },
  {
    groupName: 'Address',
    fields: [
      {
        fieldName: 'country',
        name: 'Country',
        type: 'text',
        autofull: true,
        required: true,
        info: true,
      },
      {
        fieldName: 'region',
        name: 'Region',
        type: 'text',
        autofull: true,
        required: true,
        info: true,
      },
      {
        fieldName: 'city',
        name: 'City',
        type: 'text',
        autofull: true,
        required: true,
        info: true,
      },
      {
        fieldName: 'street',
        name: 'Street',
        type: 'text',
        autofull: false,
        required: true,
        info: true,
      },
      {
        fieldName: 'bilding',
        name: 'Bilding',
        type: 'text',
        autofull: false,
        required: false,
        info: true,
      },
      {
        fieldName: 'block',
        name: 'Block',
        type: 'text',
        autofull: false,
        required: false,
        info: true,
      },
      {
        fieldName: 'coords',
        name: 'Coords',
        type: 'text',
        autofull: false,
        required: false,
        placeholder: "43.434954,40.442885",
        info: false,
      },
    ]
  }
]