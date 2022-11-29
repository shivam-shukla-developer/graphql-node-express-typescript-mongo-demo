import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import authorService from './author.service';
import { service as bookService, schema as bookSchema } from '../books';

const schema = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (param) => (param?._id ? param._id : "")
        },
        name: { type: new GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(bookSchema),
            resolve: async (params) => (await bookService.find({ "author_id": params._id }))
        }
    })
})


const query: any = {};

query.authors = {
    type: new GraphQLList(schema),
    description: 'List of All Authors',
    resolve: async () => (await authorService.find())
};

query.author = {
    type: schema,
    description: 'A Single Author',
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent: any, args: any) => {
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Author Id specified is not valid.");
        const result = await authorService.findById(args.id);
        if (result === null) throw new Error("Author specified not found.");
        return result;
    }
}
const mutation: any = {};

mutation.addAuthor = {
    type: schema,
    description: 'Add an author',
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent: any, args: any) => {
        const author = await authorService.save({ name: args.name });
        return author
    }
}

mutation.updateAuthor = {
    type: schema,
    description: 'Update an author',
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Author Id specified is not valid.");

        const params:any = {};
        if (args.name !== undefined) params.name = args.name;

        const author = await authorService.findOneAndUpdate({ _id: args.id }, params);
        if (author === null) throw new Error("Invalid Author specified.");
        Object.assign(author, params);
        return author
    }
}

mutation.removeAuthor = {
    type: schema,
    description: 'Remove an author',
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent: any, args: any) => {
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Author Id specified is not valid.");
        const authorBooks = await bookService.find({ "author_id": args.id });
        if (authorBooks && authorBooks.length > 0) throw new Error(`Unable to remove author. Author has ${authorBooks.length} published books.`)
        const author = await authorService.findByIdAndDelete(args.id);
        if (author === null) throw new Error("Invalid Author specified.");
        return author
    }
}


export {
    query,
    mutation,
    schema
}