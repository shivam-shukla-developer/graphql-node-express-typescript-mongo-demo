import Book from './books.model'

export async function find(query ={}, options ={})
{   
    return await Book.find(query, options);
}

export async function findOne(query ={}, options ={})
{
    return await Book.findOne(query, options);
}

export async function save(params = {})
{
    return await new Book(params).save();
}

export async function findByIdAndDelete(id:String)
{
    return await Book.findByIdAndDelete(id);
}

export async function findById(id:String)
{
    return await Book.findById(id);
}

export async function findOneAndUpdate(query ={}, params ={})
{
    return await Book.findOneAndUpdate(query, params);
}

export default {
    find,
    findOne,
    save,
    findByIdAndDelete,
    findById,
    findOneAndUpdate
}