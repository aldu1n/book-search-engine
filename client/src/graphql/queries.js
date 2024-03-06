import { gql } from '@apollo/client';

export const GET_ME = gql`
query GetMe {
    me {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
}
`;

export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
        _id
        title
        authors
    }
}
`;