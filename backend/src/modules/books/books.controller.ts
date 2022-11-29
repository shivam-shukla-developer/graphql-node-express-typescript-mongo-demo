import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import bookService from './books.service';
import {service as authorService, schema as authorSchema} from '../authors'

const schema:any = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by Author',
  fields: () => ({
      id: {
          type: new GraphQLNonNull(GraphQLString),
          resolve: (param) => (param?._id ? param._id: "")
      },
      author_id: {
          type: new GraphQLNonNull(GraphQLString),
          resolve: (param) => (param?.author_id ? param.author_id: "")
      },
      name: {
          type: new GraphQLNonNull(GraphQLString),
          resolve: (param) => (param?.name ? param.name: "")
      },
      description: {
          type: new GraphQLNonNull(GraphQLString),
          resolve: (param) => (param?.description ? param.description: "")
      },
      url: {
          type: new GraphQLNonNull(GraphQLString),
          resolve: (param) => (param?.url ? param.url: "")
      },
      author : {
        type : authorSchema,
        resolve: async (params:any) => (await authorService.findById(params.author_id))
      }
  })
})


const query: any = {};

query.books = {
  type: new GraphQLList(schema),
  description: 'List of All Books',
  resolve: async () => (await bookService.find())
};

query.book = {
  type: schema,
  description: 'A Single Book',
  args: {
      id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (parent: any, args: any) => {
      if (!args.id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Book Id specified is not valid.");        
      const result = await bookService.findById(args.id);
      if (result === null) throw new Error("Book not found.");
      return result;
  }
}

const mutation: any = {};


mutation.addBook = {
    type: schema,
    description: 'Add an Book',
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        author: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent: any, args: any) => {
      if (!args.author.match(/^[0-9a-fA-F]{24}$/) || (await authorService.findById(args.author) === null)) throw new Error("Author Id specified is not valid.");        

        const book = await bookService.save({ name: args.name, description: args.description, url: args.url, author_id: args.author});
        return book
    }
}

mutation.updateBook = {
    type: schema,
    description: 'Update an book',
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        author: { type: GraphQLString }
    },
    resolve: async (parent: any, args: any) => {
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Book Id specified is not valid.");
        if (!args.author.match(/^[0-9a-fA-F]{24}$/) || (await authorService.findById(args.author) === null)) throw new Error("Author Id specified is not valid.");

        const params = ["name", "description", "url"].reduce((prevValue:any, currentValue:string) => {
          if (currentValue in args) prevValue[currentValue] = args[currentValue];
          return prevValue;
        }, {})
        if (args.author !== undefined) params.author_id = args.author;

        const book = await bookService.findOneAndUpdate({ _id: args.id }, params);
        if (book === null) throw new Error("Invalid Book specified.");
        Object.assign(book, params);
        return book
    }
}

mutation.removeBook = {
    type: schema,
    description: 'Remove an book',
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent: any, args: any) => {
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Book Id specified is not valid.");
        const book = await bookService.findByIdAndDelete(args.id);
        if (book === null) throw new Error("Invalid Book specified.");
        return book;
    }
}


export {
  query,
  mutation,
  schema
}