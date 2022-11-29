import { Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { config } from '../config';

// import all schemas
import { query as authorQuery, mutation as authorMutation } from '../modules/authors';
import { query as bookQuery, mutation as bookMutation } from '../modules/books';

// Create root query
const RootQuery = new GraphQLObjectType({
    name: "Query",
    description: "RootQuery",
    fields: {
        ...authorQuery,
        ...bookQuery
    }
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        ...authorMutation,
        ...bookMutation
    })
})


const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutationType
})


const router = Router();
router.use(config.graphqlUrl, graphqlHTTP({
    schema,
    graphiql: config.graphiql
}))

export default router;