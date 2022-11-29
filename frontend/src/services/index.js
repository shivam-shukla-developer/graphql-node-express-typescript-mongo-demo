import axios from 'axios';
const API_URL = process.env.REACT_APP_SERVER_URL;


export default async function __fetch(params) {
    params.headers = {
        'Content-Type': 'application/json',
        ...params.headers
    }
    return await axios.post(API_URL, params);
}

export function objectToQuery(params)
{
    const query =  Object.keys(params).reduce((prevValue, currentValue) => {
        if (prevValue !== '') prevValue+=`,`;
        prevValue += `${currentValue}:"${params[currentValue]}"`
        return prevValue;
    }, '');
    return query;
}