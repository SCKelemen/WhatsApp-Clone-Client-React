import gql from 'graphql-tag'
import * as React from 'react'
import { useCallback } from 'react'
import { useApolloClient, useQuery, useMutation } from 'react-apollo-hooks'
import styled from 'styled-components'
import ChatNavbar from './ChatNavbar'
import MessageInput from './MessageInput'
import MessagesList from './MessagesList'

const Container = styled.div `
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`

const getChatQuery = gql `
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
`

const addMessageMutation = gql `
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      id
      content
      createdAt
    }
  }
`

const ChatRoomScreen = ({ history, match }) => {
  const { params: { chatId } } = match
  const client = useApolloClient()
  const { data: { chat } } = useQuery(getChatQuery, {
    variables: { chatId }
  })
  const addMessage = useMutation(addMessageMutation)

  const onSendMessage = useCallback((content) => {
    addMessage({
      variables: { chatId, content },
      optimisticResponse: {
        __typename: 'Mutation',
        addMessage: {
          __typename: 'Message',
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          content,
        }
      },
      update: (client, { data: { addMessage } }) => {
        client.writeQuery({
          query: getChatQuery,
          variables: { chatId },
          data: {
            chat: {
              ...chat,
              messages: chat.messages.concat(addMessage),
            },
          },
        })
      },
    })
  }, [chat])

  if (!chat) return null

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      <MessagesList messages={chat.messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  )
}

export default ChatRoomScreen
