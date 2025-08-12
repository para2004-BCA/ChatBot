import { gql } from '@apollo/client'

// Chats
export const LIST_CHATS = gql`
  query ListChats {
    chats(order_by: { updated_at: desc_nulls_last }) {
      id
      title
      created_at
      updated_at
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
    }
  }
`

// Messages
export const LIST_MESSAGES = gql`
  query ListMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      role
      content
      created_at
    }
  }
`

export const MESSAGES_SUB = gql`
  subscription MessagesSub($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      role
      content
      created_at
    }
  }
`

export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, role: "user", content: $content }) {
      id
    }
  }
`

// Hasura Action: sendMessage -> triggers n8n webhook and returns assistant reply
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      reply
    }
  }
`