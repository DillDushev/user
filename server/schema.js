const User = require('./models')

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLID, 
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = require('graphql')

const Total = new GraphQLObjectType({
  name: 'Total',
  fields: () => ({
    total: {type: GraphQLInt}
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    email: {type: GraphQLString},
    name: {type: GraphQLString}
  })
})

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    email: {type: GraphQLString},
    name: {type: GraphQLString}
  })
})

const UpdateUserInput = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: () => ({
    email: {type: GraphQLString},
    name: {type: GraphQLString}
  })
})

async function queryTotal () {
  const c =  await User.countDocuments({});
  return c
}

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    total: {
      type: Total,
      resolve: async (parent, args) => {
        const total = await User.countDocuments({});
        return {total}
      }
    },
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve: (parent, args) => {
        return User.findById(args.id)
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        skip: {type: GraphQLInt},
        limit: {type: GraphQLInt}
      },
      resolve: (parent, {limit = 10, skip = 0}) => {
        return User.find({}, null, {skip: skip * limit, limit})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        input: {type: new GraphQLNonNull(CreateUserInput)}
      },
      resolve: (parent, {input}) => {
        let user = new User({...input})
        return user.save()
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: {type:  new GraphQLNonNull(GraphQLID)},
        input: {type: new GraphQLNonNull(UpdateUserInput)}
      },
      resolve: (parent, {input, id}) => {
        return User.findOneAndUpdate({_id: id}, {...input})
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {type:  new GraphQLNonNull(GraphQLID)},
      },
      resolve: (parent, {id}) => User.deleteOne({ _id: id })
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

