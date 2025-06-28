export type User = {
  id: string;
  name: string;
};

const userSchema = {
  title: 'user schema',
  version: 0,
  description: 'A user document',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 36,
    },
    name: {
      type: 'string',
    },
  },
  required: ['id', 'name'],
};

export default userSchema;
