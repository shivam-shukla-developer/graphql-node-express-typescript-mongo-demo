import __fetch from './index';

export async function getAuthors(fields = `id, name`) {
    const data = {
        query: `query {
            authors {
              ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function getAuthor(authorId, fields = `id, name`) {
    const data = {
        query: `query {
            author(id: "${authorId}"){
              ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function addAuthor(params = {}, fields = `id, name`) {
    const data = {
        query: `mutation{
            addAuthor(name: "${params.name}") {
                ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function removeAuthor(params={}, fields=`id, name`) {
    const data = {
        query: `mutation{
            removeAuthor(id: "${params.id}") {
                ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function updateAuthor(params, fields=`id, name`) {
    const data = {
        query: `mutation{
            updateAuthor(${params}) {
              ${fields}
            }
        }`
    };
    return await __fetch(data);
}