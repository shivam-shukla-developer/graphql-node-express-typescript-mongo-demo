import Author from './author.model'

export async function find(query ={}, options ={})
{
    return await Author.find(query, options);
}

export async function findOne(query ={}, options ={})
{
    return await Author.findOne(query, options);
}

export async function save(params = {})
{
    return await new Author(params).save();
}

export async function findByIdAndDelete(id:String)
{
    return await Author.findByIdAndDelete(id);
}

export async function findById(id:String)
{
    return await Author.findById(id);
}

export async function findOneAndUpdate(query ={}, params ={})
{
    return await Author.findOneAndUpdate(query, params);
}

export default {
    find,
    findOne,
    save,
    findByIdAndDelete,
    findById,
    findOneAndUpdate
}