import {Schema, model} from 'mongoose';

interface IAuthor {
    name: string
}

const authorSchema = new Schema<IAuthor>({
    name: {
        type: Schema.Types.String,
        required: true,
    }
});

authorSchema.index( { "name": 1 }, { unique: true } );

const errorHandler = function (error:any, doc:Document, next:any) {
    if (error.keyPattern.name != null && error.code === 11000) {
        next(new Error(`Duplicate entry found for ${error.keyValue.name}`));
    } else {
        next(error);
    }
};

authorSchema.post<IAuthor>("save", errorHandler);
authorSchema.post<IAuthor>('update', errorHandler);
authorSchema.post<IAuthor>('findOneAndUpdate', errorHandler);
authorSchema.post<IAuthor>('insertMany', errorHandler);

const Author = model<IAuthor>("Author", authorSchema);


export default Author;