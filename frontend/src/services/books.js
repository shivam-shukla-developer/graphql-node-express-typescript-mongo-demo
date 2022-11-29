import __fetch, {objectToQuery} from './index';

export async function getBooks(fields = `id, name`) {
    const data = {
        query: `query {
            books {
              ${fields}
            }
          }`
    };

    return await __fetch(data);
}

export async function getBook(bookId, fields = `id, name`) {
    const data = {
        query: `query {
            book(id: "${bookId}"){
              ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function addBook(params = {}, fields = `id, name`) {
    const query = objectToQuery(params);
    const data = {
        query: `mutation{
            addBook(${query}) {
                ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function removeBook(params={}, fields=`id, name`) {
    const query = objectToQuery(params);
    const data = {
        query: `mutation{
            removeBook(${query}) {
                ${fields}
            }
          }`
    };
    return await __fetch(data);
}

export async function updateBook(params, fields=`id, name`) {
    const query = objectToQuery(params);
    const data = {
        query: `mutation{
            updateBook(${query}) {
              ${fields}
            }
        }`
    };
    return await __fetch(data);
}