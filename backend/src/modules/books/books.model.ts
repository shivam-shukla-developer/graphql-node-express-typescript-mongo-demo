import { Schema, model, Error, Document } from 'mongoose';

interface IBook {
    name: String;
    description?: String;
    url?: String;
    author_id: Schema.Types.ObjectId;
}

const BookSchema = new Schema<IBook>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
    },
    url: {
        type: Schema.Types.String,
    },
    author_id: {
        type: Schema.Types.ObjectId,
        required: true,
    }
}
);
BookSchema.index({ "name": 1, "author_id": 1 }, { unique: true });

const errorHandler = function (error:any, doc:Document, next:any) {
    if (error.keyPattern.name != null && error.keyPattern.author_id != null && error.code === 11000) {
        next(new Error(`Duplicate entry found for ${error.keyValue.name}`));
    } else {
        next(error);
    }
}

BookSchema.post<IBook>("save", errorHandler);
BookSchema.post<IBook>('update', errorHandler);
BookSchema.post<IBook>('findOneAndUpdate', errorHandler);
BookSchema.post<IBook>('insertMany', errorHandler);

const Book = model<IBook>("Book", BookSchema);

export default Book;